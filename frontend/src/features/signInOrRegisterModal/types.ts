type SignInOrRegisterModalProps = {
  jobId: string;
  onClose: () => void;
};

type Mode = "sign-in" | "register";

export type {
    SignInOrRegisterModalProps,
    Mode
}