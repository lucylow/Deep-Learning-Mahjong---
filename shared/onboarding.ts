export type OnboardingSignals = {
  hasMatch: boolean;
  hasReview: boolean;
  hasPractice: boolean;
};

export type OnboardingStep = {
  id: "match" | "review" | "practice";
  title: string;
  description: string;
  complete: boolean;
};

export const buildOnboardingSteps = (signals: OnboardingSignals): OnboardingStep[] => [
  {
    id: "match",
    title: "Create your first table",
    description: "Start a real AI match to generate your first visible-state decision record.",
    complete: signals.hasMatch,
  },
  {
    id: "review",
    title: "Review one decision",
    description: "Open a saved replay and inspect why Sensei ranked the available lines.",
    complete: signals.hasReview,
  },
  {
    id: "practice",
    title: "Complete one drill",
    description: "Answer a guided scenario so your learning profile starts from your own choices.",
    complete: signals.hasPractice,
  },
];

export const onboardingCompletion = (steps: OnboardingStep[]): number => {
  if (!steps.length) return 0;
  return steps.filter((step) => step.complete).length / steps.length;
};
