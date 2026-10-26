import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useCurrentUser } from "../auth/queries";
import { getApplicationErrorMessage, useSubmitApplication } from "../applications/mutations";
import { useMyApplications } from "../applications/queries";
import Footer from "../../components/Footer";
import { useJob } from "./queries";
import type { JobSinglePageProps } from "./types";


export default function JobSinglePage({ jobId }: JobSinglePageProps) {
  const { data, error, isLoading } = useJob(jobId);
  const [saved, setSaved] = useState(false);
  const { data: user, isLoading: isAuthLoading } = useCurrentUser();
  const applicationsQuery = useMyApplications(user?.id);
  const isApplied = applicationsQuery.data?.data.jobIds.includes(jobId) ?? false;
  const applicationMutation = useSubmitApplication();
  const job = data?.data;

  return (
    <>
      <main>
        <section id="top" className="border-b border-line">
          <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
            <Link to="/jobs" className="link font-mono text-xs uppercase tracking-[0.12em]">
              ← All jobs
            </Link>

            {isLoading ? (
              <p className="mt-8 font-mono text-sm text-mute" role="status">
                Loading role...
              </p>
            ) : error || !job ? (
              <div className="mt-8 border border-line bg-panel p-6 sm:p-8">
                <p className="font-mono text-xs uppercase tracking-[0.16em] text-teal-400">
                  WE HUSTLE / ROLE DETAILS
                </p>
                <h1 className="mt-3 font-display text-2xl font-bold sm:text-3xl">
                  {error ? "This role could not be loaded" : "Role not found"}
                </h1>
                <p className="mt-2 text-sm text-mute">
                  {error
                    ? "Please try again in a moment."
                    : "This job may have been removed or the link may be incorrect."}
                </p>
              </div>
            ) : (
              <>
                <div className="mt-8 flex flex-wrap items-center gap-2">
                  <p className="inline-flex items-center gap-2 border border-teal-400/30 bg-teal-400/5 px-3 py-1.5 font-mono text-xs uppercase tracking-[0.16em] text-teal-400">
                    <span
                      aria-hidden="true"
                      className="size-1.5 animate-pulse rounded-full bg-teal-400 shadow-[0_0_10px_var(--color-teal-400)]"
                    />
                    Open role
                  </p>
                  <span className="border border-line px-2 py-1 font-mono text-xs text-mute">
                    {job.jobType}
                  </span>
                </div>
                <div className="mt-4 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
                  <div>
                    <h1 className="font-display text-3xl font-bold tracking-tight sm:text-5xl">
                      {job.title}
                    </h1>
                    <p className="mt-3 text-lg text-mute">
                      <span className="text-ink">{job.company}</span>
                      <span className="mx-2 text-line" aria-hidden="true">/</span>
                      {job.location}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => setSaved((currentSaved) => !currentSaved)}
                      aria-pressed={saved}
                      aria-label={`${saved ? "Unsave" : "Save"} ${job.title}`}
                      className={`btn btn-ghost ${saved ? "border-teal-400 text-teal-400" : ""}`}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill={saved ? "currentColor" : "none"}
                        stroke="currentColor"
                        strokeWidth="2"
                        aria-hidden="true"
                      >
                        <path d="M6 3h12v18l-6-4-6 4V3Z" />
                      </svg>
                      {saved ? "Saved" : "Save"}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </section>

        {job && !isLoading && !error && (
          <section className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:px-6 sm:py-12 lg:grid-cols-[1fr_20rem]">
            <div className="space-y-6">
              <article className="border border-line bg-panel p-5 sm:p-8">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-teal-400">01</span>
                  <h2 className="font-display text-xl font-semibold sm:text-2xl">
                    The opportunity
                  </h2>
                </div>
                <div className="mt-5 whitespace-pre-line border-l border-teal-400/40 pl-4 text-sm leading-7 text-mute sm:pl-5 sm:text-base">
                  {job.description}
                </div>
              </article>

              <article
                id="apply"
                className="scroll-mt-8 border border-teal-400/30 bg-teal-400/[0.06] p-5 sm:p-8"
              >
                <p className="font-mono text-xs uppercase tracking-[0.16em] text-teal-400">
                  Your next move
                </p>
                <h2 className="mt-2 font-display text-xl font-semibold sm:text-2xl">
                  Interested in this role?
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-mute">
                  Take a closer look at the role details, then apply when you’re ready to make your move.
                </p>
                {isAuthLoading ? (
                  <p role="status" className="mt-5 text-sm text-mute">Checking sign-in...</p>
                ) : user?.id ? (
                  <button
                    type="button"
                    className="btn btn-primary mt-5 disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={applicationMutation.isPending || applicationsQuery.isLoading || isApplied}
                    onClick={() => applicationMutation.mutate(job.id)}
                  >
                    {applicationMutation.isPending
                      ? "Applying..."
                      : applicationsQuery.isLoading
                        ? "Checking..."
                        : isApplied
                          ? "Applied"
                          : "Apply now"}
                    {!applicationMutation.isPending && !applicationsQuery.isLoading && !isApplied && (
                      <span aria-hidden="true"> →</span>
                    )}
                  </button>
                ) : (
                  <p className="mt-5 text-sm text-mute">
                    <Link to="/sign-in" className="link text-teal-400">Sign in</Link>
                    {" "}to apply for this role.
                  </p>
                )}
                {applicationMutation.isSuccess && (
                  <p role="status" className="mt-3 text-sm text-teal-400">
                    Your application was submitted.
                  </p>
                )}
                {applicationMutation.isError && (
                  <p role="alert" className="mt-3 text-sm text-red-200">
                    {getApplicationErrorMessage(applicationMutation.error)}
                  </p>
                )}
              </article>
            </div>

            <aside className="space-y-4">
              <section className="border border-line bg-panel p-5" aria-labelledby="role-facts">
                <div className="flex items-center justify-between gap-3">
                  <h2 id="role-facts" className="font-display text-lg font-semibold">
                    Role snapshot
                  </h2>
                  <span className="font-mono text-xs text-teal-400">DETAILS</span>
                </div>
                <dl className="mt-5 divide-y divide-line">
                  <div className="py-3">
                    <dt className="font-mono text-xs text-mute">Compensation</dt>
                    <dd className="mt-1 text-sm font-medium text-teal-400">
                      {job.salary || "Not specified"}
                    </dd>
                  </div>
                  <div className="py-3">
                    <dt className="font-mono text-xs text-mute">Location</dt>
                    <dd className="mt-1 text-sm">{job.location}</dd>
                  </div>
                  <div className="py-3">
                    <dt className="font-mono text-xs text-mute">Employment</dt>
                    <dd className="mt-1 text-sm">{job.jobType}</dd>
                  </div>
                  <div className="py-3">
                    <dt className="font-mono text-xs text-mute">Applications</dt>
                    <dd className="mt-1 text-sm">
                      {job.applicationCount}{" "}
                      {job.applicationCount === 1 ? "applicant" : "applicants"}
                    </dd>
                  </div>
                  <div className="py-3">
                    <dt className="font-mono text-xs text-mute">Posted</dt>
                    <dd className="mt-1 text-sm">
                      {new Date(job.postedAt).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </dd>
                  </div>
                </dl>
              </section>

              <div className="border border-line bg-panel/60 p-5">
                <p className="font-mono text-xs uppercase tracking-[0.12em] text-mute">
                  WE HUSTLE / CAREER MOVE
                </p>
                <p className="mt-2 font-display text-lg font-semibold">
                  Find work that moves you forward.
                </p>
                <Link to="/jobs" className="link mt-4 text-sm">
                  Explore more roles
                </Link>
              </div>
            </aside>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
