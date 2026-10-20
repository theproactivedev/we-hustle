const cols = [
  { title: "Developers", links: [["Browse jobs", "/#jobs"], ["Register", "/register"], ["Sign In", "/sign-in"]] },
  { title: "Employers", links: [["Post a Job", "/jobs/new"], ["Pricing", "/pricing"], ["Hiring guide", "/guide"]] },
  { title: "Stackhire", links: [["About", "/about"], ["Privacy", "/privacy"], ["Terms", "/terms"]] },
];

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.5fr_repeat(3,1fr)]">
        <div>
          <p className="font-display text-lg font-semibold text-teal-400">Stackhire</p>
          <p className="mt-2 max-w-xs text-sm text-mute">Jobs for software developers, listed by stack and salary.</p>
        </div>
        {cols.map((c) => (
          <nav key={c.title} aria-label={c.title}>
            <p className="font-display text-sm font-semibold">{c.title}</p>
            <ul className="mt-3 space-y-2 text-sm">
              {c.links.map(([l, h]) => <li key={l}><a href={h} className="link text-mute">{l}</a></li>)}
            </ul>
          </nav>
        ))}
      </div>
      <p className="border-t border-line py-5 text-center font-mono text-xs text-mute">&copy; 2026 Stackhire</p>
    </footer>
  );
}
