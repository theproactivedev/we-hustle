import Footer from "./Footer";
import Header from "./Header";
import JobBoard from "./JobBoard";
import { jobs } from "./jobs";

const stats = [["142", "open roles"], ["58", "hiring teams"], ["$4.8k", "median monthly pay"]];
const steps = [
  ["Write the role", "Title, stack and salary range. Salary is required, so developers don't have to guess."],
  ["Preview it live", "See exactly how your listing looks to candidates before it goes out."],
  ["Review applicants", "Applications land in your inbox, tagged with the skills they match."],
];

export default function App() {
  return (
    <>
      <Header />
      <main>
        <section className="relative overflow-hidden border-b border-line">
          <div aria-hidden className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(var(--color-line)_1px,transparent_1px),linear-gradient(90deg,var(--color-line)_1px,transparent_1px)] [background-size:40px_40px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
          <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
            <p className="inline-flex items-center gap-2 font-mono text-sm text-teal-400">
              <span className="pulse-dot size-2 animate-pulse rounded-full bg-teal-400 shadow-[0_0_10px_var(--color-teal-400)]" />
              {jobs.length} new roles this week
            </p>
            <h1 className="mt-5 max-w-3xl font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl">Find a job in the stack you already ship.</h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-mute sm:text-lg">Every listing shows the tech, the salary range and whether it&apos;s remote. Search below, save roles, and apply in a few clicks.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#jobs" className="btn btn-primary">Browse jobs</a>
              <a href="/jobs/new" className="btn btn-ghost">Post a job</a>
            </div>
            <dl className="mt-12 grid max-w-2xl grid-cols-3 border-l border-line font-mono">
              {stats.map(([n, l]) => (
                <div key={l} className="border-r border-line px-3 sm:px-5">
                  <dt className="text-xl text-teal-400 sm:text-3xl">{n}</dt>
                  <dd className="mt-1 text-xs text-mute sm:text-sm">{l}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <JobBoard jobs={jobs} />

        <section className="border-y border-line bg-panel/60" aria-labelledby="hire-heading">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
            <h2 id="hire-heading" className="max-w-xl font-display text-2xl font-semibold sm:text-3xl">Hiring developers? Post a role in about five minutes.</h2>
            <ol className="mt-8 grid gap-4 md:grid-cols-3">
              {steps.map(([t, d], i) => (
                <li key={t} className="border border-line bg-void p-5">
                  <span className="font-mono text-sm text-teal-400">Step {i + 1}</span>
                  <h3 className="mt-2 font-display text-lg font-semibold">{t}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-mute">{d}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
