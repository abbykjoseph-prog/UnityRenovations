"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { useEffect, useReducer, useRef, useState, type ComponentType, type ReactNode, type SVGProps } from "react";
import {
  budgetRanges,
  formatPhone,
  HONEYPOT_FIELD,
  labelFor,
  projectTypes,
  serviceToProjectType,
  stepSequence,
  timelines,
  toPayload,
  type InquiryData,
  type ProjectType,
  type StepId,
} from "@/lib/inquiry";
import { site } from "@/lib/site";
import { TURNSTILE_FIELD, turnstileSiteKey } from "@/lib/turnstile-config";
import { buttonClasses } from "@/components/ui/Button";
import { ArrowLeftIcon, ArrowRightIcon, ChatIcon, CheckIcon, HomeIcon, InstagramIcon, MailIcon, PhoneIcon } from "@/components/ui/Icons";
import { initialInquiryState, inquiryReducer } from "./inquiryReducer";

type Icon = ComponentType<SVGProps<SVGSVGElement>>;

const headings: Record<StepId, string> = {
  path: "How can we help?",
  projectType: "What type of project?",
  hasBudget: "Do you have a budget in mind?",
  budget: "What’s your budget range?",
  timeline: "What’s your desired timeline?",
  name: "Who are we speaking to?",
  method: "How should we contact you?",
  contactValue: "",
  message: "Anything you’d like to add?",
  review: "Check your details",
};

function projectTypeFromParams(params: URLSearchParams): ProjectType | undefined {
  const t = params.get("type");
  if (!t) return undefined;
  if (projectTypes.some((o) => o.value === t)) return t as ProjectType;
  return serviceToProjectType[t];
}

export function InquiryStepper() {
  const params = useSearchParams();
  const [state, dispatch] = useReducer(inquiryReducer, undefined, () =>
    initialInquiryState({ project: params.get("path") === "project", projectType: projectTypeFromParams(params) }),
  );
  const { data, step, status, errors } = state;

  const headingRef = useRef<HTMLHeadingElement>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);
  const startedAt = useRef(Date.now());
  const hasInteracted = useRef(false);

  // A "Get a Quote" link clicked while already on this page jumps to the project path
  const pathParam = params.get("path");
  const typeParam = params.get("type");
  const lastParams = useRef(`${pathParam}|${typeParam}`);
  useEffect(() => {
    const key = `${pathParam}|${typeParam}`;
    if (key === lastParams.current) return;
    lastParams.current = key;
    if (pathParam === "project") {
      hasInteracted.current = true;
      dispatch({ type: "startProject", projectType: projectTypeFromParams(new URLSearchParams({ type: typeParam ?? "" })) });
    }
  }, [pathParam, typeParam]);

  // Move focus to each new step's heading (but not on first page load)
  useEffect(() => {
    if (!hasInteracted.current) return;
    headingRef.current?.focus({ preventScroll: true });
    headingRef.current?.closest("section")?.scrollIntoView({ block: "nearest" });
  }, [step, status === "success"]); // eslint-disable-line react-hooks/exhaustive-deps

  // Put focus on the field that needs fixing
  useEffect(() => {
    if (Object.keys(errors).length === 0) return;
    document.querySelector<HTMLElement>('[data-inquiry] [aria-invalid="true"]')?.focus();
  }, [errors]);

  const act: typeof dispatch = (action) => {
    hasInteracted.current = true;
    dispatch(action);
  };
  const choose = (patch: Partial<InquiryData>) => act({ type: "choose", patch });
  const update = (patch: Partial<InquiryData>) => dispatch({ type: "update", patch });

  async function send(turnstileToken: string) {
    act({ type: "submitStart" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...toPayload(data),
          [HONEYPOT_FIELD]: honeypotRef.current?.value ?? "",
          startedAt: startedAt.current,
          [TURNSTILE_FIELD]: turnstileToken,
        }),
      });
      const json = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        confirmationSent?: boolean;
        error?: string;
        errors?: Record<string, string>;
      };
      if (res.ok && json.ok) return act({ type: "submitSuccess", confirmationSent: json.confirmationSent === true });
      if (json.errors) return act({ type: "serverErrors", errors: json.errors });
      if (json.error === "verification-failed") return act({ type: "submitError", reason: "verification" });
      if (json.error === "verification-unavailable" || json.error === "email-unavailable")
        return act({ type: "submitError", reason: "unavailable" });
      act({ type: "submitError" });
    } catch {
      act({ type: "submitError" });
    }
  }

  const seq = stepSequence(data);
  const index = seq.indexOf(step);
  const total = seq.length;

  if (status === "success") {
    return (
      <section aria-labelledby="inquiry-heading" className="rounded-sm bg-ink p-8 text-paper sm:p-12" data-inquiry>
        <div className="step-in-forward">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-accent text-2xl text-white">
            <CheckIcon />
          </span>
          <h2 id="inquiry-heading" ref={headingRef} tabIndex={-1} className="mt-6 text-3xl font-medium focus:outline-none sm:text-4xl">
            Thanks, {data.name.trim().split(/\s+/)[0]}! We&rsquo;ll be in touch within 1 business day.
          </h2>
          {state.confirmationSent && (
            <p className="mt-4 text-lg leading-relaxed text-paper">We&rsquo;ve also sent a confirmation to your email.</p>
          )}
          <p className="mt-4 text-lg leading-relaxed text-muted-dark">
            In the meantime, see our latest work on Instagram.
          </p>
          <a
            href={site.instagram.href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-3 text-lg font-semibold text-white underline-offset-4 hover:underline"
          >
            <InstagramIcon className="text-2xl text-accent-light" />
            {site.instagram.handle}
            <span className="sr-only"> on Instagram (opens in a new tab)</span>
          </a>
        </div>
      </section>
    );
  }

  const heading =
    step === "contactValue"
      ? data.contactMethod === "email"
        ? "What’s your email address?"
        : "What’s the best number to reach you?"
      : headings[step];

  return (
    <section
      aria-labelledby="inquiry-heading"
      className="relative overflow-hidden rounded-sm bg-paper-100 p-5 ring-1 ring-ink/10 sm:p-10"
      data-inquiry
    >
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-sm text-muted">
          <span aria-hidden="true">{total > 1 ? `Step ${index + 1} of ${total}` : "Let’s get started"}</span>
          {index > 0 && (
            <button
              type="button"
              onClick={() => act({ type: "back" })}
              className="inline-flex items-center gap-2 rounded-sm px-2 py-1 font-medium text-ink hover:bg-ink/5"
            >
              <ArrowLeftIcon /> Back
            </button>
          )}
        </div>
        <div
          role="progressbar"
          aria-label="Progress"
          aria-valuemin={1}
          aria-valuemax={Math.max(total, 1)}
          aria-valuenow={index + 1}
          aria-valuetext={total > 1 ? `Step ${index + 1} of ${total}` : "Step 1"}
          className="mt-3 h-1 overflow-hidden rounded-full bg-ink/10"
        >
          <div
            className="h-full rounded-full bg-accent transition-[width] duration-500 ease-out"
            style={{ width: `${total > 1 ? ((index + 1) / total) * 100 : 8}%` }}
          />
        </div>
      </div>

      <div key={`${step}-${data.contactMethod}`} className={state.direction === "back" ? "step-in-back" : "step-in-forward"}>
        <h2
          id="inquiry-heading"
          ref={headingRef}
          tabIndex={-1}
          className="text-3xl font-medium leading-tight tracking-tight focus:outline-none sm:text-4xl"
        >
          {heading}
        </h2>

        <div className="mt-8">
          {step === "path" && (
            <Options labelledBy="inquiry-heading" columns={1}>
              <PathOption
                icon={ChatIcon}
                title="I need to reach you"
                description="A question, a callback, or anything else."
                selected={data.path === "contact"}
                onClick={() => choose({ path: "contact" })}
              />
              <PathOption
                icon={HomeIcon}
                title="I have a project in mind"
                description="Tell us about it and get a free estimate."
                selected={data.path === "project"}
                onClick={() => choose({ path: "project" })}
              />
            </Options>
          )}

          {step === "projectType" && (
            <Options labelledBy="inquiry-heading">
              {projectTypes.map((o) => (
                <Option key={o.value} selected={data.projectType === o.value} onClick={() => choose({ projectType: o.value })}>
                  {o.label}
                </Option>
              ))}
            </Options>
          )}

          {step === "hasBudget" && (
            <Options labelledBy="inquiry-heading">
              <Option selected={data.hasBudget === true} onClick={() => choose({ hasBudget: true })}>
                Yes
              </Option>
              <Option selected={data.hasBudget === false} onClick={() => choose({ hasBudget: false })}>
                No, not yet
              </Option>
            </Options>
          )}

          {step === "budget" && (
            <Options labelledBy="inquiry-heading">
              {budgetRanges.map((o) => (
                <Option key={o.value} selected={data.budgetRange === o.value} onClick={() => choose({ budgetRange: o.value })}>
                  {o.label}
                </Option>
              ))}
            </Options>
          )}

          {step === "timeline" && (
            <Options labelledBy="inquiry-heading">
              {timelines.map((o) => (
                <Option key={o.value} selected={data.timeline === o.value} onClick={() => choose({ timeline: o.value })}>
                  {o.label}
                </Option>
              ))}
            </Options>
          )}

          {step === "method" && (
            <Options labelledBy="inquiry-heading">
              <Option icon={MailIcon} selected={data.contactMethod === "email"} onClick={() => choose({ contactMethod: "email" })}>
                Email
              </Option>
              <Option icon={PhoneIcon} selected={data.contactMethod === "phone"} onClick={() => choose({ contactMethod: "phone" })}>
                Phone
              </Option>
            </Options>
          )}

          {step === "name" && (
            <TextStep onContinue={() => act({ type: "continue" })} error={errors.name} field="name">
              <input
                id="inquiry-name"
                type="text"
                autoComplete="name"
                enterKeyHint="next"
                aria-labelledby="inquiry-heading"
                aria-invalid={errors.name ? true : undefined}
                aria-describedby={errors.name ? "inquiry-name-error" : undefined}
                value={data.name}
                onChange={(e) => update({ name: e.target.value })}
                className={inputClasses}
                placeholder="Your name"
              />
            </TextStep>
          )}

          {step === "contactValue" && data.contactMethod === "email" && (
            <TextStep onContinue={() => act({ type: "continue" })} error={errors.email} field="email">
              <input
                id="inquiry-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                enterKeyHint="next"
                aria-labelledby="inquiry-heading"
                aria-invalid={errors.email ? true : undefined}
                aria-describedby={errors.email ? "inquiry-email-error" : undefined}
                value={data.email}
                onChange={(e) => update({ email: e.target.value })}
                className={inputClasses}
                placeholder="name@example.com"
              />
            </TextStep>
          )}

          {step === "contactValue" && data.contactMethod === "phone" && (
            <TextStep onContinue={() => act({ type: "continue" })} error={errors.phone} field="phone">
              <input
                id="inquiry-phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel-national"
                enterKeyHint="next"
                aria-labelledby="inquiry-heading"
                aria-invalid={errors.phone ? true : undefined}
                aria-describedby={errors.phone ? "inquiry-phone-error" : "inquiry-phone-hint"}
                value={data.phone}
                onChange={(e) => update({ phone: formatPhone(e.target.value) })}
                className={inputClasses}
                placeholder="(416) 555-1234"
              />
              <p id="inquiry-phone-hint" className="mt-2 text-sm text-muted">
                Canadian or US number, 10 digits.
              </p>
            </TextStep>
          )}

          {step === "message" && (
            <TextStep onContinue={() => act({ type: "continue" })} error={errors.message} field="message" buttonLabel="Review">
              <textarea
                id="inquiry-message"
                rows={5}
                aria-labelledby="inquiry-heading"
                aria-invalid={errors.message ? true : undefined}
                aria-describedby={errors.message ? "inquiry-message-error inquiry-message-hint" : "inquiry-message-hint"}
                value={data.message}
                onChange={(e) => update({ message: e.target.value })}
                onKeyDown={(e) => {
                  // Enter adds a new line; Ctrl/Cmd+Enter continues
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                    e.preventDefault();
                    act({ type: "continue" });
                  }
                }}
                className={`${inputClasses} resize-y`}
                placeholder={
                  data.path === "project"
                    ? "Anything that would help us understand your project (optional)"
                    : "How can we help?"
                }
              />
              <p id="inquiry-message-hint" className="mt-2 text-sm text-muted">
                {data.path === "project" ? "Optional." : "A short message is enough."}
              </p>
            </TextStep>
          )}

          {step === "review" && (
            <Review
              data={data}
              status={status}
              errorReason={state.errorReason}
              onEdit={(s) => act({ type: "edit", step: s })}
              onSend={send}
            />
          )}
        </div>
      </div>

      {/* Honeypot: hidden from people and assistive tech, tempting to bots */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={HONEYPOT_FIELD}>Leave this field empty</label>
        <input ref={honeypotRef} id={HONEYPOT_FIELD} name={HONEYPOT_FIELD} type="text" tabIndex={-1} autoComplete="off" />
      </div>
    </section>
  );
}

const inputClasses =
  "block w-full rounded-sm border border-ink/25 bg-white px-4 py-4 text-lg text-ink placeholder:text-muted/70 transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 aria-[invalid=true]:border-red-700";

function Options({ children, labelledBy, columns = 2 }: { children: ReactNode; labelledBy: string; columns?: 1 | 2 }) {
  return (
    <div role="group" aria-labelledby={labelledBy} className={`grid gap-3 ${columns === 2 ? "sm:grid-cols-2" : ""}`}>
      {children}
    </div>
  );
}

function Option({
  children,
  selected,
  onClick,
  icon: IconCmp,
}: {
  children: ReactNode;
  selected: boolean;
  onClick: () => void;
  icon?: Icon;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className="group flex min-h-[3.75rem] w-full items-center gap-3 rounded-sm border border-ink/15 bg-white px-5 py-4 text-left text-lg font-medium text-ink transition-colors hover:border-ink/50 aria-pressed:border-accent aria-pressed:bg-accent/5"
    >
      {IconCmp && <IconCmp className="shrink-0 text-xl text-accent-dark" />}
      <span className="flex-1">{children}</span>
      <CheckIcon className="shrink-0 text-xl text-accent-dark opacity-0 group-aria-pressed:opacity-100" />
    </button>
  );
}

function PathOption({
  icon: IconCmp,
  title,
  description,
  selected,
  onClick,
}: {
  icon: Icon;
  title: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className="group flex w-full items-center gap-4 rounded-sm border border-ink/15 bg-white p-5 text-left transition-colors hover:border-ink/50 aria-pressed:border-accent aria-pressed:bg-accent/5 sm:gap-5 sm:p-7"
    >
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-ink text-xl text-accent-light sm:h-14 sm:w-14 sm:text-2xl">
        <IconCmp />
      </span>
      <span className="flex-1">
        <span className="block font-display text-xl font-medium text-ink sm:text-2xl">{title}</span>
        <span className="mt-1 block text-muted">{description}</span>
      </span>
      <ArrowRightIcon className="hidden shrink-0 text-xl text-accent-dark transition-transform group-hover:translate-x-1 sm:block" />
    </button>
  );
}

function TextStep({
  children,
  onContinue,
  error,
  field,
  buttonLabel = "Continue",
}: {
  children: ReactNode;
  onContinue: () => void;
  error?: string;
  field: string;
  buttonLabel?: string;
}) {
  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        onContinue();
      }}
    >
      {children}
      {error && (
        <p id={`inquiry-${field}-error`} className="mt-2 font-medium text-red-700" role="alert">
          {error}
        </p>
      )}
      <button type="submit" className={buttonClasses("primary", "lg", "mt-6 w-full sm:w-auto")}>
        {buttonLabel} <ArrowRightIcon />
      </button>
    </form>
  );
}

function Review({
  data,
  status,
  errorReason,
  onEdit,
  onSend,
}: {
  data: InquiryData;
  status: "idle" | "submitting" | "success" | "error";
  errorReason: "verification" | "unavailable" | "general" | null;
  onEdit: (step: StepId) => void;
  onSend: (turnstileToken: string) => void;
}) {
  // Cloudflare Turnstile bot check: Send stays disabled until it returns a token
  const turnstileRef = useRef<TurnstileInstance>(null);
  const [token, setToken] = useState<string | null>(null);
  const [checkMessage, setCheckMessage] = useState<string | null>(null);
  // Errors such as a misconfigured key or domain repeat forever, so only auto-reset a couple of times
  const errorCount = useRef(0);
  const [checkBlocked, setCheckBlocked] = useState(false);

  const restartCheck = (message: string | null) => {
    setToken(null);
    setCheckMessage(message);
    turnstileRef.current?.reset();
  };

  const handleCheckError = () => {
    errorCount.current += 1;
    if (errorCount.current <= 2) {
      restartCheck("The security check didn’t load properly. We’ve reset it, so please try again.");
      return;
    }
    setToken(null);
    setCheckBlocked(true);
    setCheckMessage(null);
  };

  const retryCheck = () => {
    errorCount.current = 0;
    setCheckBlocked(false);
    restartCheck(null);
  };

  // Tokens can only be used once, so get a fresh one after any failed send
  useEffect(() => {
    if (status === "error") restartCheck(null);
  }, [status]);

  const rows: { label: string; value: string; step: StepId }[] = [
    { label: "Reason", value: data.path === "project" ? "I have a project in mind" : "I need to reach you", step: "path" },
  ];
  if (data.path === "project") {
    rows.push(
      { label: "Project type", value: labelFor(projectTypes, data.projectType), step: "projectType" },
      {
        label: "Budget",
        value: data.hasBudget ? labelFor(budgetRanges, data.budgetRange) : "No budget in mind yet",
        step: data.hasBudget ? "budget" : "hasBudget",
      },
      { label: "Timeline", value: labelFor(timelines, data.timeline), step: "timeline" },
    );
  }
  rows.push(
    { label: "Name", value: data.name.trim(), step: "name" },
    {
      label: data.contactMethod === "email" ? "Email" : "Phone",
      value: data.contactMethod === "email" ? data.email.trim() : formatPhone(data.phone),
      step: "contactValue",
    },
    { label: "Message", value: data.message.trim() || "None", step: "message" },
  );

  return (
    <div>
      <dl className="divide-y divide-ink/10 border-y border-ink/10">
        {rows.map((r) => (
          <div key={r.label} className="flex items-start gap-4 py-4">
            <div className="min-w-0 flex-1">
              <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">{r.label}</dt>
              <dd className="mt-1 whitespace-pre-line break-words text-lg">{r.value}</dd>
            </div>
            <button
              type="button"
              onClick={() => onEdit(r.step)}
              className="shrink-0 rounded-sm px-2 py-1 font-semibold text-accent-dark underline underline-offset-4 hover:bg-ink/5"
              aria-label={`Edit ${r.label.toLowerCase()}`}
            >
              Edit
            </button>
          </div>
        ))}
      </dl>

      {status === "error" && (
        <div role="alert" className="mt-6 rounded-sm border border-red-700/40 bg-red-50 p-4 text-red-900">
          {errorReason === "verification" ? (
            <>We couldn&rsquo;t confirm you&rsquo;re not a bot. Your answers are saved, so please complete the check below and send again.</>
          ) : errorReason === "unavailable" ? (
            <>Our online form is temporarily unavailable. Your answers are saved, but the quickest way to reach us right now is</>
          ) : (
            <>Sorry, we couldn&rsquo;t send your message just now. Your answers are saved, so please try again. You can also</>
          )}
          {errorReason !== "verification" && (
            <>
              {" "}
              call{" "}
              <a href={site.phoneHref} className="font-semibold underline">
                {site.phone}
              </a>{" "}
              or email{" "}
              <a href={`mailto:${site.email}`} className="font-semibold underline">
                {site.email}
              </a>
              .
            </>
          )}
        </div>
      )}

      {/* Bot check on the left; privacy note and Send on the right (stacked on mobile) */}
      <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-8">
        <div className="shrink-0">
          {turnstileSiteKey ? (
            <Turnstile
              ref={turnstileRef}
              siteKey={turnstileSiteKey}
              options={{ theme: "auto", size: "compact", refreshExpired: "manual" }}
              onSuccess={(t) => {
                errorCount.current = 0;
                setToken(t);
                setCheckMessage(null);
              }}
              onExpire={() => restartCheck("The security check timed out. Please complete it again.")}
              onError={handleCheckError}
              onTimeout={() => restartCheck("The security check timed out. Please complete it again.")}
            />
          ) : (
            <p className="rounded-sm border border-ink/15 bg-white p-4 text-sm">
              Online sending is temporarily unavailable. Please call{" "}
              <a href={site.phoneHref} className="font-semibold underline">
                {site.phone}
              </a>{" "}
              or email{" "}
              <a href={`mailto:${site.email}`} className="font-semibold underline">
                {site.email}
              </a>
              .
            </p>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm text-muted">
            By sending, you agree to our{" "}
            <Link href="/privacy" className="font-medium text-accent-dark underline underline-offset-4 hover:text-ink">
              Privacy Policy
            </Link>
            .
          </p>

          <button
            type="button"
            onClick={() => token && onSend(token)}
            disabled={status === "submitting" || !token}
            aria-describedby={!token ? "send-hint" : undefined}
            className={buttonClasses("primary", "lg", "mt-3 w-full sm:w-auto")}
          >
            {status === "submitting" ? "Sending…" : status === "error" ? "Try again" : "Send"}
            {status !== "submitting" && <ArrowRightIcon />}
          </button>
          {!token && status !== "submitting" && turnstileSiteKey && (
            <p id="send-hint" className="mt-2 text-sm text-muted">
              Complete the security check to send.
            </p>
          )}
        </div>
      </div>
      <div className="mt-3 min-h-[1.25rem] text-sm" aria-live="polite">
        {checkBlocked ? (
          <p className="text-red-700">
            The security check isn&rsquo;t loading right now.{" "}
            <button type="button" onClick={retryCheck} className="font-semibold underline underline-offset-4">
              Try again
            </button>
            , or call{" "}
            <a href={site.phoneHref} className="font-semibold underline">
              {site.phone}
            </a>{" "}
            or email{" "}
            <a href={`mailto:${site.email}`} className="font-semibold underline">
              {site.email}
            </a>
            .
          </p>
        ) : (
          checkMessage && <p className="text-red-700">{checkMessage}</p>
        )}
      </div>
    </div>
  );
}
