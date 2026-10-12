import {
  emptyInquiry,
  isStepComplete,
  stepSequence,
  validateStep,
  type InquiryData,
  type ProjectType,
  type StepErrors,
  type StepId,
} from "@/lib/inquiry";

export type Status = "idle" | "submitting" | "success" | "error";

export type InquiryState = {
  data: InquiryData;
  step: StepId;
  /** Drives the slide direction of the step transition */
  direction: "forward" | "back";
  /** True after "Edit" on the review screen: completing a step returns to the review */
  editing: boolean;
  errors: StepErrors;
  status: Status;
  /** Why the last send failed, so the review step can show the right message */
  errorReason: "verification" | "unavailable" | "general" | null;
};

export type InquiryAction =
  | { type: "choose"; patch: Partial<InquiryData> } // option buttons: save and advance
  | { type: "update"; patch: Partial<InquiryData> } // typing in a field: save only
  | { type: "continue" } // text steps: validate, then advance
  | { type: "back" }
  | { type: "edit"; step: StepId }
  | { type: "startProject"; projectType?: ProjectType }
  | { type: "submitStart" }
  | { type: "submitSuccess" }
  | { type: "submitError"; reason?: "verification" | "unavailable" }
  | { type: "serverErrors"; errors: Record<string, string> };

export function initialInquiryState(opts?: { project?: boolean; projectType?: ProjectType }): InquiryState {
  const data: InquiryData = opts?.project
    ? { ...emptyInquiry, path: "project", projectType: opts.projectType ?? null }
    : emptyInquiry;
  return { data, step: opts?.project ? "projectType" : "path", direction: "forward", editing: false, errors: {}, status: "idle", errorReason: null };
}

function nextStep(state: InquiryState, data: InquiryData): StepId {
  const seq = stepSequence(data);
  const i = seq.indexOf(state.step);
  if (state.editing) {
    // Return to the review unless the change opened up a step that still needs an answer
    return seq.slice(i + 1).find((s) => s !== "review" && !isStepComplete(s, data)) ?? "review";
  }
  return seq[i + 1] ?? "review";
}

function advance(state: InquiryState, data: InquiryData): InquiryState {
  const step = nextStep(state, data);
  return { ...state, data, step, direction: "forward", errors: {}, editing: state.editing && step !== "review" };
}

/** Maps a server field error back to the step where it can be fixed. */
const fieldStep: Record<string, StepId> = {
  path: "path",
  projectType: "projectType",
  hasBudget: "hasBudget",
  budgetRange: "budget",
  timeline: "timeline",
  name: "name",
  contactMethod: "method",
  email: "contactValue",
  phone: "contactValue",
  message: "message",
};

export function inquiryReducer(state: InquiryState, action: InquiryAction): InquiryState {
  switch (action.type) {
    case "choose":
      return advance(state, { ...state.data, ...action.patch });

    case "update": {
      // Clear a field's error as soon as the visitor edits it
      const errors = { ...state.errors };
      for (const key of Object.keys(action.patch)) delete errors[key as keyof StepErrors];
      return { ...state, data: { ...state.data, ...action.patch }, errors };
    }

    case "continue": {
      const errors = validateStep(state.step, state.data);
      if (Object.keys(errors).length > 0) return { ...state, errors };
      return advance(state, state.data);
    }

    case "back": {
      const seq = stepSequence(state.data);
      const i = seq.indexOf(state.step);
      if (i <= 0) return state;
      return { ...state, step: seq[i - 1], direction: "back", errors: {}, status: state.status === "error" ? "idle" : state.status };
    }

    case "edit":
      return { ...state, step: action.step, direction: "back", editing: true, errors: {}, status: "idle" };

    case "startProject":
      if (state.data.path === "project" && state.step !== "path") return state;
      return {
        ...state,
        data: { ...state.data, path: "project", projectType: action.projectType ?? state.data.projectType },
        step: "projectType",
        direction: "forward",
        editing: false,
        errors: {},
      };

    case "submitStart":
      return { ...state, status: "submitting", errorReason: null };
    case "submitSuccess":
      return { ...state, status: "success" };
    case "submitError":
      return { ...state, status: "error", errorReason: action.reason ?? "general" };

    case "serverErrors": {
      // Send the visitor to the first step with a problem, keeping all their answers
      const seq = stepSequence(state.data);
      const steps = Object.keys(action.errors).map((k) => fieldStep[k]).filter(Boolean);
      const step = seq.find((s) => steps.includes(s)) ?? "review";
      const errors: StepErrors = {};
      for (const k of ["name", "email", "phone", "message"] as const) if (action.errors[k]) errors[k] = action.errors[k];
      return { ...state, step, direction: "back", editing: true, errors, status: "idle" };
    }
  }
}
