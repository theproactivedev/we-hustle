type SignInOrRegisterModalProps = {
  jobId: string;
  intent: "apply" | "save";
  onClose: () => void;
};

type Mode = "sign-in" | "register";

type AuthModalState = { jobId: string; intent: "apply" | "save" } | null;

export type {
  SignInOrRegisterModalProps,
  Mode,
  AuthModalState
}