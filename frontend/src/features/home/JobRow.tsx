import { Link } from "@tanstack/react-router";
import type { JobRowProps } from "./types";


export default function JobRow({
  job,
  saved = false,
  onSave,
  isSavedLoading = false,
  isSavePending = false,
  saveError,
  onApply,
  isAuthLoading = false,
  isApplicationsLoading = false,
  isApplied = false,
  isApplying = false,
  applicationMessage,
  applicationError,
}: JobRowProps) {
  return (
    <article className="group relative grid gap-4 px-5 py-5 transition-colors duration-200 hover:bg-teal-400/[0.06] sm:grid-cols-[1fr_auto] sm:gap-8 sm:px-6">
      <span aria-hidden className="absolute inset-y-0 left-0 w-0.5 origin-top scale-y-0 bg-teal-400 transition-transform duration-200 group-hover:scale-y-100 group-focus-within:scale-y-100" />

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-display text-lg font-semibold leading-snug transition-colors group-hover:text-teal-400">
              <Link
                to="/jobs/$jobId"
                params={{ jobId: job.id }}
                className="after:absolute after:inset-0 focus-visible:outline-offset-0"
              >
                {job.title}
              </Link>
          </h3>
          <span className="border border-teal-400/50 px-1.5 py-0.5 font-mono text-xs text-teal-400">{job.jobType}</span>
        </div>
        <p className="mt-0.5 text-sm text-mute">
          {job.company || "Company"}
        </p>
        <p className="mt-0.5 text-sm text-mute">
          {job.location || "Location"}
        </p>

        {/* TODO: Add stack to Job model */}
        {/* <ul className="mt-3 flex flex-wrap gap-2" aria-label="Tech stack">
          {["Remote", "Development"].map((t) => (
            <li key={t} className="border border-line px-2 py-0.5 font-mono text-xs text-mute transition-colors group-hover:border-teal-400/40">{t}</li>
          ))}
        </ul> */}

      </div>

      <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end sm:justify-center">
        <div className="font-mono text-sm sm:text-right">
          <p className="text-teal-400">{job.salary || "Salary range"}</p>
          <p className="text-mute">
            {new Date(job.postedAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
        
        <div className="relative z-10 flex items-center items-stretch gap-2">
          <button
            type="button"
            onClick={() => onSave?.(job.id)}
            aria-pressed={saved}
            aria-label={`${saved ? "Remove saved" : "Save"} ${job.title}`}
            disabled={isAuthLoading || isSavedLoading || isSavePending}
            className={`flex items-center gap-2 border px-3 transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${saved ? "border-teal-400 bg-teal-400/10 text-teal-400" : "border-line text-mute hover:border-teal-400 hover:text-teal-400"}`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M6 3h12v18l-6-4-6 4V3Z" /></svg>
            {isSavePending
              ? saved ? "Removing..." : "Saving..."
              : isAuthLoading || isSavedLoading
                ? "Checking..."
                : saved
                  ? "Saved"
                  : "Save"}
          </button>
          <button
            type="button"
            onClick={() => onApply?.(job.id)}
            disabled={isApplying || isAuthLoading || isApplicationsLoading || isApplied}
            className="btn btn-primary cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isApplying
              ? "Applying..."
              : isAuthLoading || isApplicationsLoading
                ? "Checking..."
                : isApplied
                  ? "Applied"
                  : "Apply"}
          </button>
        </div>
      </div>
      {applicationMessage && (
        <p role="status" className="relative z-10 text-right text-sm text-teal-400 sm:col-span-2">
          {applicationMessage}
        </p>
      )}
      {applicationError && (
        <p role="alert" className="relative z-10 text-right text-sm text-red-200 sm:col-span-2">
          {applicationError}
        </p>
      )}
      {saveError && (
        <p role="alert" className="relative z-10 text-right text-sm text-red-200 sm:col-span-2">
          {saveError}
        </p>
      )}
    </article>
  );
}
