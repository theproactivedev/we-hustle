import { createFileRoute, Link } from "@tanstack/react-router";
import axios from "axios";
import { useState, type SubmitEvent } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { useSignIn } from "../features/auth/mutations";

export const Route = createFileRoute('/sign-in')({
  component: SignInPage,
});

function getErrorMessage(error: unknown) {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message ?? "We couldn't sign you in. Please try again.";
  }
  return "We couldn't sign you in. Please try again.";
}

function SignInPage() {
  const [fields, setFields] = useState({ emailAddress: "", password: "" });
  const [validationError, setValidationError] = useState("");
  const signInMutation = useSignIn();

  const updateField = (field: keyof typeof fields, value: string) => {
    setFields((current) => ({ ...current, [field]: value }));
    setValidationError("");
    signInMutation.reset();
  };

  const handleSubmit = (event: SubmitEvent) => {
    event.preventDefault();
    signInMutation.reset();

    const emailAddress = fields.emailAddress.trim();
    if (!emailAddress || !fields.password) {
      setValidationError("Enter your email address and password.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress)) {
      setValidationError("Enter a valid email address.");
      return;
    }

    setValidationError("");
    signInMutation.mutate({ emailAddress, password: fields.password });
  };

  const errorMessage = validationError || (signInMutation.isError ? getErrorMessage(signInMutation.error) : "");
  const hasAllFields = Boolean(fields.emailAddress.trim() && fields.password);

  return (
    <>
      <Header />
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
              Your next move is waiting
            </p>
            <h1 className="mt-6 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              Pick up where <span className="text-teal-400">your ambition left off.</span>
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-mute sm:text-lg">
              Sign in to get back to work that fits your skills, your goals, and the way you want to work.
            </p>

            <div className="mt-9 border border-line bg-void/75 p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.16em] text-teal-400">Featured opportunity</p>
                  <h2 className="mt-2 font-display text-xl font-semibold">Senior Frontend Engineer</h2>
                  <p className="mt-1 text-sm text-mute">Build thoughtful products with a remote-first team.</p>
                </div>
                <span aria-hidden="true" className="border border-teal-400/30 bg-teal-400/5 px-2 py-1 font-mono text-xs text-teal-400">REMOTE</span>
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line pt-4 font-mono text-xs text-mute">
                <span>React · TypeScript</span>
                <span className="text-teal-400">$140k–$180k</span>
                <span>New this week</span>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-3 border-l-2 border-teal-400/60 pl-4">
              <span aria-hidden="true" className="font-mono text-2xl text-teal-400">{"{"}</span>
              <p className="text-sm text-mute">Your next chapter, without the noise.</p>
              <span aria-hidden="true" className="font-mono text-2xl text-teal-400">{"}"}</span>
            </div>
          </section>

          <section aria-labelledby="sign-in-heading" className="relative mx-auto w-full max-w-lg border border-line bg-panel/90 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.28)] sm:p-8">
            <div aria-hidden="true" className="absolute right-0 top-0 h-8 w-8 border-r border-t border-teal-400/60" />
            <div className="mb-7">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-teal-400">Welcome back</p>
              <h2 id="sign-in-heading" className="mt-2 font-display text-2xl font-semibold sm:text-3xl">Sign in to Stackhire.</h2>
              <p className="mt-2 text-sm text-mute">Your saved jobs and fresh opportunities are right here.</p>
            </div>

            <form className="space-y-4" noValidate onSubmit={handleSubmit}>
              <div>
                <label htmlFor="emailAddress" className="mb-1.5 block text-sm font-medium">Email Address</label>
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
              <div>
                <label htmlFor="password" className="mb-1.5 block text-sm font-medium">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className="field"
                  required
                  value={fields.password}
                  onChange={(event) => updateField("password", event.target.value)}
                />
              </div>

              {errorMessage && (
                <p role="alert" className="border border-red-400/40 bg-red-400/10 px-3 py-2.5 text-sm text-red-200">
                  {errorMessage}
                </p>
              )}

              <button
                type="submit"
                className="btn btn-primary w-full py-3 cursor-pointer disabled:cursor-not-allowed disabled:bg-line disabled:text-mute disabled:opacity-60 disabled:hover:bg-line disabled:hover:shadow-none"
                disabled={!hasAllFields || signInMutation.isPending}
              >
                {signInMutation.isPending ? "Signing you in..." : "Sign in"}
                {!signInMutation.isPending && <span aria-hidden="true">→</span>}
              </button>
              <p className="text-center text-sm text-mute">
                New to Stackhire? <Link to="/register" className="link text-teal-400">Create an account</Link>
              </p>
            </form>
            <p className="mt-6 border-t border-line pt-4 font-mono text-[11px] leading-relaxed text-mute">
              Clear opportunities. A focused job search. Let&apos;s get you back in.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
