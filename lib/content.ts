// Shared marketing copy: the core promises and the five-step process.

export type PromiseKey = "quality" | "materials" | "time" | "budget" | "respect" | "communication";

export const promises: { key: PromiseKey; title: string; body: string }[] = [
  {
    key: "quality",
    title: "Flawless workmanship",
    body: "We never sacrifice quality for the bottom line or a time crunch. Every joint, seam and finish is done right, even the ones you'll never see.",
  },
  {
    key: "materials",
    title: "High-quality materials only",
    body: "We build with materials we'd put in our own homes, chosen to look good on day one and hold up for decades.",
  },
  {
    key: "time",
    title: "On time, every time",
    body: "You get a realistic schedule before work begins, and we stick to it. Your life shouldn't be on hold indefinitely.",
  },
  {
    key: "budget",
    title: "On budget, no surprises",
    body: "Your budget is respected and maintained. Pricing is transparent from the first quote, so there are no surprise costs at the end.",
  },
  {
    key: "respect",
    title: "Respect for your home",
    body: "We treat your home, your time and your family with respect, with protected floors, contained dust and a clean, organized job site every day.",
  },
  {
    key: "communication",
    title: "Clear communication",
    body: "From the first quote to the final walkthrough, you always know what's happening, what's next, and who to call.",
  },
];

export const processSteps: { title: string; body: string }[] = [
  {
    title: "Consultation",
    body: "It all starts with you. We meet, walk through the space and listen to your ideas, priorities and budget.",
  },
  {
    title: "Detailed quote",
    body: "You receive a clear, itemized quote, free of charge. Transparent pricing means you know exactly what's included before any work begins.",
  },
  {
    title: "Planning & materials",
    body: "We finalize the plan, confirm your selections and order quality materials, and you get a fixed timeline you can plan around.",
  },
  {
    title: "Build",
    body: "Our team gets to work on a protected, organized site, with regular updates so you're never left wondering where things stand.",
  },
  {
    title: "Final walkthrough",
    body: "We walk through the finished space together and make sure every detail meets your expectations, and ours.",
  },
];
