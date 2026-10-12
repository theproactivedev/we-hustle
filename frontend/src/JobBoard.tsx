import { useState } from "react";
import JobRow from "./JobRow";
import type { Job } from "./dataTypes";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const chamfer = "[clip-path:polygon(0_0,calc(100%-20px)_0,100%_20px,100%_100%,0_100%)]";

const fetchJobs = async(): Promise<{ data: Job[] }> => {
  const res = await axios.get("/api/jobs");
  console.log("Fetched jobs:", res.data); // Log the fetched data
  return res.data;
}

export default function JobBoard() {
  const [q, setQ] = useState("");
  // const [remote, setRemote] = useState(false);
  // const [stack, setStack] = useState<string[]>([]);
  // const [saved, setSaved] = useState<string[]>([]);

  const { data: loadedJobs, error, isLoading } = useQuery({
    queryKey: ["jobs"],
    queryFn: fetchJobs,
  })

  if (isLoading) {
    return (
      <section id="jobs" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-12 sm:px-6 sm:py-16" aria-labelledby="jobs-heading">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 id="jobs-heading" className="font-display text-2xl font-semibold sm:text-3xl">Latest jobs</h2>
          <p className="font-mono text-sm text-mute" role="status" aria-live="polite">
            Loading...
          </p>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section id="jobs" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-12 sm:px-6 sm:py-16" aria-labelledby="jobs-heading">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 id="jobs-heading" className="font-display text-2xl font-semibold sm:text-3xl">Latest jobs</h2>
          <p className="font-mono text-sm text-mute" role="status" aria-live="polite">
            Error loading jobs
          </p>
        </div>
      </section>
    )
  }

  console.log("Loaded jobs:", loadedJobs); // Log the loaded jobs

  // const allStack = useMemo(() => [...new Set(loadedJobs?.flatMap((j) => j.stack) || [])].sort(), [loadedJobs]);
  // const toggle = (list: string[], v: string) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  // const results = loadedJobs?.filter((j) => {
  //   const text = `${j.title} ${j.company} ${j.location} ${j.stack.join(" ")}`.toLowerCase();
  //   return text.includes(q.toLowerCase()) && (!remote || j.remote) && stack.every((s) => j.stack.includes(s));
  // });
  // const filtered = q || remote || stack.length > 0;
  const reset = () => {};

  return (
    <section id="jobs" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-12 sm:px-6 sm:py-16" aria-labelledby="jobs-heading">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 id="jobs-heading" className="font-display text-2xl font-semibold sm:text-3xl">Latest jobs</h2>
        {/* <p className="font-mono text-sm text-mute" role="status" aria-live="polite">
          {results.length} of {jobs.length} roles{saved.length > 0 && `, ${saved.length} saved`}
        </p> */}
      </div>

      <div className="mt-5 grid gap-3">
        <label className="relative block">
          <span className="sr-only">Search jobs by title, company, location or tech</span>
          <svg className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-mute" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search title, company, city or tech" className="field py-3 pl-10" />
        </label>
        {/* <div className="flex flex-wrap gap-2" role="group" aria-label="Filters">
          {[{ label: "Remote only", on: remote, fn: () => setRemote(!remote) },
            ...allStack.map((s) => ({ label: s, on: stack.includes(s), fn: () => setStack(toggle(stack, s)) }))].map((c) => (
            <button key={c.label} type="button" aria-pressed={c.on} onClick={c.fn}
              className={`border px-3 py-1.5 font-mono text-xs transition-colors ${c.on ? "border-teal-400 bg-teal-400/10 text-teal-400" : "border-line text-mute hover:border-teal-400/60 hover:text-ink"}`}>
              {c.label}
            </button>
          ))}
          {filtered && <button type="button" onClick={reset} className="link px-1 font-mono text-xs">Clear filters</button>}
        </div> */}
      </div>

      <div className={`mt-6 bg-line p-px ${chamfer}`}>
        {loadedJobs && loadedJobs.data?.length > 0 ? (
          <div className={`divide-y divide-line bg-panel ${chamfer}`}>
            {loadedJobs.data.slice(0, 5).map((j) => (
              // saved={saved.includes(j.id)}
              // onSave={() => setSaved(toggle(saved, j.id))}
              <JobRow key={j.id} job={j} />
            ))}
          </div>
        ) : (
          <div className={`bg-panel px-6 py-14 text-center ${chamfer}`}>
            <p className="font-display text-lg font-semibold">No roles match those filters</p>
            <p className="mx-auto mt-1 max-w-sm text-sm text-mute">Remove a tech tag or search for something broader, like a city or a language.</p>
            <button type="button" onClick={reset} className="btn btn-ghost mt-5">Clear filters</button>
          </div>
        )}

        <div className="flex items-center justify-center border-t border-line bg-panel/60 p-3 text-sm font-mono text-mute">
          <a href="/jobs" className="link">Browse all roles</a>
        </div>
      </div>
    </section>
  );
}
