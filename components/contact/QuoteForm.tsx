"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import {
  budgetRanges,
  HONEYPOT_FIELD,
  projectTypes,
  timelines,
  validateQuote,
  type QuoteErrors,
  type QuoteField,
} from "@/lib/quote";
import { site } from "@/lib/site";
import { buttonClasses } from "@/components/ui/Button";
import { CheckIcon } from "@/components/ui/Icons";

type Status = "idle" | "submitting" | "success" | "error";

const FIELD_ORDER: QuoteField[] = ["name", "email", "phone", "projectType", "budget", "timeline", "message"];

const inputClasses =
  "mt-2 block w-full rounded-sm border border-ink/25 bg-paper-100 px-4 py-3 text-base text-ink placeholder:text-muted/70 transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 aria-[invalid=true]:border-red-700";

export function QuoteForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);
  const startedAt = useRef<number>(Date.now());
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<QuoteErrors>({});
  const [defaultService, setDefaultService] = useState("");

  // Preselect the project type when arriving from a service page (?service=kitchen-remodels)
  useEffect(() => {
    const service = new URLSearchParams(window.location.search).get("service");
    if (service && projectTypes.some((t) => t.value === service)) setDefaultService(service);
  }, []);

  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  const readForm = () => Object.fromEntries(new FormData(formRef.current!).entries()) as Record<string, string>;

  const focusFirstError = (errs: QuoteErrors) => {
    const first = FIELD_ORDER.find((f) => errs[f]);
    if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
  };

  // Re-validate a field on blur once it has an error, so messages clear as the visitor fixes them
  const onBlur = (field: QuoteField) => {
    if (!errors[field]) return;
    const { errors: next } = validateQuote(readForm());
    setErrors((prev) => ({ ...prev, [field]: next[field] }));
  };

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const values = readForm();
    const { errors: clientErrors } = validateQuote(values);
    setErrors(clientErrors);
    if (Object.keys(clientErrors).length > 0) {
      focusFirstError(clientErrors);
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, startedAt: startedAt.current }),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; errors?: QuoteErrors };
      if (res.ok && json.ok) {
        setStatus("success");
        return;
      }
      if (json.errors) {
        setErrors(json.errors);
        setStatus("idle");
        focusFirstError(json.errors);
        return;
      }
      setStatus("error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-sm bg-ink p-8 text-paper sm:p-12" role="status">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-accent text-2xl text-white">
          <CheckIcon />
        </span>
        <h2 ref={successRef} tabIndex={-1} className="mt-6 text-3xl font-medium focus:outline-none">
          Thank you. We&rsquo;ve received your request.
        </h2>
        <p className="mt-4 text-lg leading-relaxed text-muted-dark">
          We&rsquo;ll be in touch soon to talk about your project. If it&rsquo;s urgent, call us at{" "}
          <a href={site.phoneHref} className="font-semibold text-white underline underline-offset-4">
            {site.phone}
          </a>
          .
        </p>
      </div>
    );
  }

  const describedBy = (field: QuoteField, hint?: boolean) =>
    [hint ? `${field}-hint` : null, errors[field] ? `${field}-error` : null].filter(Boolean).join(" ") || undefined;

  const fieldProps = (field: QuoteField, hint?: boolean) => ({
    id: field,
    name: field,
    required: true,
    "aria-invalid": errors[field] ? true : undefined,
    "aria-describedby": describedBy(field, hint),
    onBlur: () => onBlur(field),
    className: inputClasses,
  });

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="grid gap-6 sm:grid-cols-2" aria-describedby="form-required-note">
      <p id="form-required-note" className="text-sm text-muted sm:col-span-2">
        All fields are required.
      </p>

      {/* Honeypot: hidden from people and assistive tech, tempting to bots */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={HONEYPOT_FIELD}>Leave this field empty</label>
        <input id={HONEYPOT_FIELD} name={HONEYPOT_FIELD} type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <Field label="Full name" field="name" error={errors.name}>
        <input type="text" autoComplete="name" {...fieldProps("name")} />
      </Field>

      <Field label="Email" field="email" error={errors.email}>
        <input type="email" autoComplete="email" inputMode="email" {...fieldProps("email")} />
      </Field>

      <Field label="Phone" field="phone" error={errors.phone}>
        <input type="tel" autoComplete="tel" inputMode="tel" placeholder="e.g. 416-555-0123" {...fieldProps("phone")} />
      </Field>

      <Field label="Project type" field="projectType" error={errors.projectType}>
        <select key={defaultService} defaultValue={defaultService} {...fieldProps("projectType")}>
          <option value="" disabled>
            Choose one…
          </option>
          {projectTypes.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Approximate budget" field="budget" error={errors.budget}>
        <select defaultValue="" {...fieldProps("budget")}>
          <option value="" disabled>
            Choose a range…
          </option>
          {budgetRanges.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Desired timeline" field="timeline" error={errors.timeline}>
        <select defaultValue="" {...fieldProps("timeline")}>
          <option value="" disabled>
            Choose a timeline…
          </option>
          {timelines.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </Field>

      <Field
        label="Tell us about your project"
        field="message"
        error={errors.message}
        hint="The space, what you'd like to change, and anything else we should know."
        className="sm:col-span-2"
      >
        <textarea rows={6} {...fieldProps("message", true)} />
      </Field>

      {status === "error" && (
        <div role="alert" className="rounded-sm border border-red-700/40 bg-red-50 p-4 text-red-900 sm:col-span-2">
          Sorry, something went wrong sending your request. Please try again, or call us at{" "}
          <a href={site.phoneHref} className="font-semibold underline">
            {site.phone}
          </a>{" "}
          or email{" "}
          <a href={`mailto:${site.email}`} className="font-semibold underline">
            {site.email}
          </a>
          .
        </div>
      )}

      <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center">
        <button type="submit" disabled={status === "submitting"} className={buttonClasses("primary", "lg")}>
          {status === "submitting" ? "Sending…" : "Request my free quote"}
        </button>
        <p className="text-sm text-muted">We&rsquo;ll only use your details to respond to your request.</p>
      </div>
    </form>
  );
}

function Field({
  label,
  field,
  error,
  hint,
  className = "",
  children,
}: {
  label: string;
  field: QuoteField;
  error?: string;
  hint?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={field} className="block text-sm font-semibold text-ink">
        {label}
      </label>
      {hint && (
        <p id={`${field}-hint`} className="mt-1 text-sm text-muted">
          {hint}
        </p>
      )}
      {children}
      {error && (
        <p id={`${field}-error`} className="mt-2 text-sm font-medium text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
