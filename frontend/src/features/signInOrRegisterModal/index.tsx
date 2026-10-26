import axios from "axios";
import { useEffect, useRef, useState, type SubmitEvent } from "react";
import { useSignIn } from "../auth/mutations";
import { getRegisterErrorMessage, getRegisterValidationError } from "../register/utils";
import { useRegister } from "../register/mutations";
import type { Mode, SignInOrRegisterModalProps } from "./types";


function SignInOrRegisterModal({ jobId, intent, onClose }: SignInOrRegisterModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [mode, setMode] = useState<Mode>("sign-in");
  const [fields, setFields] = useState({
    name: "",
    emailAddress: "",
    password: "",
    confirmPassword: "",
  });
  const [validationError, setValidationError] = useState("");
  const signInMutation = useSignIn({ jobId });
  const registerMutation = useRegister({ jobId });

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) {
      dialog.showModal();
    }
  }, []);

  useEffect(() => {
    if (signInMutation.isSuccess || registerMutation.isSuccess) {
      dialogRef.current?.close();
    }
  }, [registerMutation.isSuccess, signInMutation.isSuccess]);

  const changeMode = (nextMode: Mode) => {
    setMode(nextMode);
    setValidationError("");
    signInMutation.reset();
    registerMutation.reset();
  };

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setValidationError("");

    if (mode === "sign-in") {
      signInMutation.reset();
      const emailAddress = fields.emailAddress.trim();
      if (!emailAddress || !fields.password) {
        setValidationError("Enter your email address and password.");
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress)) {
        setValidationError("Enter a valid email address.");
      } else {
        signInMutation.mutate({ emailAddress, password: fields.password });
      }
      return;
    }

    registerMutation.reset();
    const validationMessage = getRegisterValidationError(fields);
    if (validationMessage) {
      setValidationError(validationMessage);
      return;
    }

    registerMutation.mutate({
      name: fields.name.trim(),
      emailAddress: fields.emailAddress.trim(),
      password: fields.password,
    });
  };

  const updateField = (field: keyof typeof fields, value: string) => {
    setFields((current) => ({ ...current, [field]: value }));
    setValidationError("");
    signInMutation.reset();
    registerMutation.reset();
  };

  const signInError = signInMutation.isError
    ? axios.isAxiosError<{ message?: string }>(signInMutation.error)
      ? signInMutation.error.response?.data?.message ?? "We couldn't sign you in. Please try again."
      : "We couldn't sign you in. Please try again."
    : "";
  const registerError = registerMutation.isError
    ? getRegisterErrorMessage(registerMutation.error)
    : "";
  const errorMessage = validationError || (mode === "sign-in" ? signInError : registerError);
  const isPending = mode === "sign-in" ? signInMutation.isPending : registerMutation.isPending;
  const actionLabel = intent === "save" ? "save this job" : "apply for this role";
  const hasRequiredFields = mode === "sign-in"
    ? Boolean(fields.emailAddress.trim() && fields.password)
    : Boolean(fields.name.trim() && fields.emailAddress.trim() && fields.password && fields.confirmPassword);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="auth-modal-title"
      className="m-auto max-h-[calc(100dvh-2rem)] w-[min(100%-2rem,32rem)] overflow-y-auto border border-line bg-panel p-0 text-ink shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop:bg-void/80"
      onClose={onClose}
    >
      <section className="relative p-5 sm:p-8">
        <div aria-hidden="true" className="absolute right-0 top-0 h-8 w-8 border-r border-t border-teal-400/60" />
        <button
          type="button"
          onClick={() => dialogRef.current?.close()}
          aria-label="Close sign-in dialog"
          className="absolute right-4 top-4 grid size-9 place-items-center border border-line text-mute hover:border-teal-400 hover:text-teal-400"
        >
          <span aria-hidden="true">×</span>
        </button>
        <p className="pr-10 font-mono text-xs uppercase tracking-[0.18em] text-teal-400">
          {intent === "save" ? "Continue saving this job" : "Continue your application"}
        </p>
        <h2 id="auth-modal-title" className="mt-2 font-display text-2xl font-semibold sm:text-3xl">
          {intent === "save" ? "Sign in to save this job." : "Sign in to apply."}
        </h2>
        <p className="mt-2 text-sm text-mute">
          Sign in or create an account to {actionLabel}.
        </p>

        <div className="mt-6 grid grid-cols-2 border border-line" role="tablist" aria-label="Account options">
          {(["sign-in", "register"] as const).map((option) => (
            <button
              key={option}
              id={`${option}-tab`}
              type="button"
              role="tab"
              aria-selected={mode === option}
              aria-controls="auth-form-panel"
              onClick={() => changeMode(option)}
              className={`px-3 py-3 font-mono text-xs uppercase tracking-[0.12em] transition-colors ${
                option === "register" ? "border-l border-line" : ""
              } ${mode === option ? "bg-teal-400/10 text-teal-400" : "text-mute hover:text-ink"}`}
            >
              {option === "sign-in" ? "Sign in" : "Create account"}
            </button>
          ))}
        </div>

        <div
          id="auth-form-panel"
          role="tabpanel"
          aria-labelledby={`${mode}-tab`}
          className="mt-5"
        >
          <form className="space-y-4" noValidate onSubmit={handleSubmit}>
            {mode === "register" && (
              <div>
                <label htmlFor="modal-name" className="mb-1.5 block text-sm font-medium">Name</label>
                <input
                  id="modal-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Your name"
                  className="field"
                  required
                  value={fields.name}
                  onChange={(event) => updateField("name", event.target.value)}
                />
              </div>
            )}
            <div>
              <label htmlFor="modal-email" className="mb-1.5 block text-sm font-medium">Email address</label>
              <input
                id="modal-email"
                name="emailAddress"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className="field"
                required
                value={fields.emailAddress}
                onChange={(event) => updateField("emailAddress", event.target.value)}
              />
            </div>
            <div>
              <label htmlFor="modal-password" className="mb-1.5 block text-sm font-medium">Password</label>
              <input
                id="modal-password"
                name="password"
                type="password"
                autoComplete={mode === "sign-in" ? "current-password" : "new-password"}
                placeholder={mode === "sign-in" ? "Enter your password" : "Create a password"}
                className="field"
                required
                minLength={mode === "register" ? 8 : undefined}
                value={fields.password}
                onChange={(event) => updateField("password", event.target.value)}
              />
            </div>
            {mode === "register" && (
              <div>
                <label htmlFor="modal-confirm-password" className="mb-1.5 block text-sm font-medium">
                  Confirm password
                </label>
                <input
                  id="modal-confirm-password"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Repeat your password"
                  className="field"
                  required
                  minLength={8}
                  value={fields.confirmPassword}
                  onChange={(event) => updateField("confirmPassword", event.target.value)}
                />
              </div>
            )}
            {errorMessage && (
              <p role="alert" className="border border-red-400/40 bg-red-400/10 px-3 py-2.5 text-sm text-red-200">
                {errorMessage}
              </p>
            )}
            <button
              type="submit"
              className="btn btn-primary w-full py-3 disabled:cursor-not-allowed disabled:bg-line disabled:text-mute disabled:opacity-60 disabled:hover:bg-line disabled:hover:shadow-none"
              disabled={!hasRequiredFields || isPending}
            >
              {isPending
                ? mode === "sign-in" ? "Signing you in..." : "Creating your account..."
                : mode === "sign-in" ? "Sign in" : "Create account"}
              {!isPending && <span aria-hidden="true"> →</span>}
            </button>
          </form>
        </div>
        <p className="mt-6 border-t border-line pt-4 font-mono text-[11px] leading-relaxed text-mute">
          Clear opportunities, focused applications. Your details stay yours.
        </p>
      </section>
    </dialog>
  );
}

export default SignInOrRegisterModal;
