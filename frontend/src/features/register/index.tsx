import { useState, type SubmitEvent } from "react";
import Footer from "../../components/Footer";
import { useRegister } from "./mutations";
import { getRegisterErrorMessage, getRegisterValidationError } from "./utils";

function Register() {
  const [fields, setFields] = useState({
    name: "",
    emailAddress: "",
    password: "",
    confirmPassword: "",
  });
  const [validationError, setValidationError] = useState("");
  const mutation = useRegister();

  const handleSubmit = (event: SubmitEvent) => {
    event.preventDefault();
    mutation.reset();

    const validationMessage = getRegisterValidationError(fields);
    if (validationMessage) {
      setValidationError(validationMessage);
      return;
    }

    setValidationError("");
    mutation.mutate({
      name: fields.name.trim(),
      emailAddress: fields.emailAddress.trim(),
      password: fields.password,
    });
  };

  const updateField = (field: keyof typeof fields, value: string) => {
    setFields((current) => ({ ...current, [field]: value }));
    setValidationError("");
    mutation.reset();
  };

  const errorMessage =
    validationError || (mutation.isError ? getRegisterErrorMessage(mutation.error) : "");
  const hasAllFields = Boolean(
    fields.name.trim() &&
      fields.emailAddress.trim() &&
      fields.password &&
      fields.confirmPassword,
  );

  return (
    <>
      <main className="relative isolate min-h-[calc(100vh-4rem)] overflow-hidden border-b border-line">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 opacity-40 [background-image:linear-gradient(var(--color-line)_1px,transparent_1px),linear-gradient(90deg,var(--color-line)_1px,transparent_1px)] [background-size:40px_40px] [mask-image:linear-gradient(to_bottom,black,transparent_90%)]"
        />
        <div aria-hidden="true" className="pointer-events-none absolute -right-40 top-12 -z-10 size-[28rem] rounded-full bg-teal-400/10 blur-[100px]" />

        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1fr_0.85fr] lg:gap-20 lg:py-20">
          <section className="max-w-xl">
            <p className="inline-flex items-center gap-2 border border-teal-400/30 bg-teal-400/5 px-3 py-1.5 font-mono text-xs uppercase tracking-[0.16em] text-teal-400">
              <span aria-hidden="true" className="size-1.5 animate-pulse rounded-full bg-teal-400 shadow-[0_0_10px_var(--color-teal-400)]" />
              Your next chapter starts here
            </p>
            <h1 className="mt-6 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              Good work deserves a <span className="text-teal-400">better match.</span>
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-mute sm:text-lg">
              Create your free account and find roles that put the tech, pay, and remote details up front.
            </p>

            <div className="mt-9 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {[
                ["01", "Find your stack", "Explore roles built around the tools you know."],
                ["02", "Know the details", "See salary ranges and work setup before applying."],
                ["03", "Move with intent", "Save promising roles and apply when it feels right."],
              ].map(([number, title, description]) => (
                <article key={number} className="border border-line bg-void/75 p-4 sm:p-5">
                  <div className="flex items-start gap-3">
                    <span className="font-mono text-sm text-teal-400">{number}</span>
                    <div>
                      <h2 className="font-display font-semibold">{title}</h2>
                      <p className="mt-1 text-sm leading-relaxed text-mute">{description}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-8 hidden items-center gap-3 border-l-2 border-teal-400/60 pl-4 lg:flex">
              <span aria-hidden="true" className="font-mono text-2xl text-teal-400">{"{"}</span>
              <p className="text-sm text-mute">Less guessing. More building.</p>
              <span aria-hidden="true" className="font-mono text-2xl text-teal-400">{"}"}</span>
            </div>
          </section>

          <section aria-labelledby="register-heading" className="relative mx-auto w-full max-w-lg border border-line bg-panel/90 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.28)] sm:p-8">
            <div aria-hidden="true" className="absolute right-0 top-0 h-8 w-8 border-r border-t border-teal-400/60" />
            <div className="mb-7">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-teal-400">Create an account</p>
              <h2 id="register-heading" className="mt-2 font-display text-2xl font-semibold sm:text-3xl">Join the board.</h2>
              <p className="mt-2 text-sm text-mute">A few details, then you&apos;re ready to explore.</p>
            </div>

            {mutation.isSuccess ? (
              <div role="status" className="border border-teal-400/40 bg-teal-400/10 p-5">
                <p className="font-display text-lg font-semibold text-teal-400">You&apos;re on your way.</p>
                <p className="mt-2 text-sm leading-relaxed text-ink">{mutation.data.message}</p>
                <a href="/sign-in" className="btn btn-primary mt-5 w-full">Continue to sign in</a>
              </div>
            ) : (
              <form className="space-y-4" noValidate onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="name" className="mb-1.5 block text-sm font-medium">Name</label>
                  <input
                    id="name"
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
                <div>
                  <label htmlFor="emailAddress" className="mb-1.5 block text-sm font-medium">Email address</label>
                  <input
                    id="emailAddress"
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
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="password" className="mb-1.5 block text-sm font-medium">Password</label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      placeholder="Create a password"
                      className="field"
                      required
                      minLength={8}
                      value={fields.password}
                      onChange={(event) => updateField("password", event.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-medium">Confirm password</label>
                    <input
                      id="confirmPassword"
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
                </div>

                {errorMessage && (
                  <p role="alert" className="border border-red-400/40 bg-red-400/10 px-3 py-2.5 text-sm text-red-200">
                    {errorMessage}
                  </p>
                )}

                <button type="submit" className="btn btn-primary w-full py-3 cursor-pointer disabled:cursor-not-allowed disabled:bg-line disabled:text-mute disabled:opacity-60 disabled:hover:bg-line disabled:hover:shadow-none" disabled={!hasAllFields || mutation.isPending}>
                  {mutation.isPending ? "Creating your account..." : "Create account"}
                  {!mutation.isPending && <span aria-hidden="true">→</span>}
                </button>
                <p className="text-center text-sm text-mute">
                  Already have an account? <a href="/sign-in" className="link text-teal-400">Sign in</a>
                </p>
              </form>
            )}
            <p className="mt-6 border-t border-line pt-4 font-mono text-[11px] leading-relaxed text-mute">
              No noise, just clear opportunities. Your details stay yours.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Register;
