import type { Job } from "./jobs";

type Props = { job: Job; saved?: boolean; onSave?: () => void; preview?: boolean };

export default function JobRow({ job, saved = false, onSave, preview }: Props) {
  return (
    <article className="group relative grid gap-4 px-5 py-5 transition-colors duration-200 hover:bg-teal-400/[0.06] sm:grid-cols-[1fr_auto] sm:gap-8 sm:px-6">
      <span aria-hidden className="absolute inset-y-0 left-0 w-0.5 origin-top scale-y-0 bg-teal-400 transition-transform duration-200 group-hover:scale-y-100 group-focus-within:scale-y-100" />

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-display text-lg font-semibold leading-snug transition-colors group-hover:text-teal-400">
            {preview ? job.title || "Job title" : (
              /* stretched link: whole row is clickable, buttons sit above it */
              <a href={`/jobs/${job.id}`} className="after:absolute after:inset-0 focus-visible:outline-offset-0">{job.title}</a>
            )}
          </h3>
          {job.isNew && <span className="border border-teal-400/50 px-1.5 py-0.5 font-mono text-xs text-teal-400">New</span>}
        </div>
        <p className="mt-0.5 text-sm text-mute">
          {job.company || "Company"}, {job.location || "Location"}{job.remote ? " (remote ok)" : ""}
        </p>
        <ul className="mt-3 flex flex-wrap gap-2" aria-label="Tech stack">
          {job.stack.map((t) => (
            <li key={t} className="border border-line px-2 py-0.5 font-mono text-xs text-mute transition-colors group-hover:border-teal-400/40">{t}</li>
          ))}
        </ul>
      </div>

      <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end sm:justify-center">
        <div className="font-mono text-sm sm:text-right">
          <p className="text-teal-400">{job.salary || "Salary range"}</p>
          <p className="text-mute">{job.posted}</p>
        </div>
        {!preview && (
          <div className="relative z-10 flex items-center gap-2">
            <button type="button" onClick={onSave} aria-pressed={saved} aria-label={`${saved ? "Unsave" : "Save"} ${job.title}`}
              className={`grid size-10 place-items-center border transition-colors ${saved ? "border-teal-400 bg-teal-400/10 text-teal-400" : "border-line text-mute hover:border-teal-400 hover:text-teal-400"}`}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M6 3h12v18l-6-4-6 4V3Z" /></svg>
            </button>
            <a href={`/jobs/${job.id}#apply`} className="btn btn-primary">Apply</a>
          </div>
        )}
      </div>
    </article>
  );
}
