export type Job = {
  id: string; title: string; company: string; location: string; remote: boolean;
  salary: string; stack: string[]; posted: string; isNew?: boolean;
};

export const jobs: Job[] = [
  { id: "1", title: "Senior Frontend Engineer", company: "Vectorly", location: "Manila", remote: true, salary: "$4k - $6k / mo", stack: ["React", "TypeScript", "Tailwind"], posted: "2h ago", isNew: true },
  { id: "2", title: "Full-Stack Developer", company: "Orbit Labs", location: "Cebu", remote: true, salary: "$3k - $5k / mo", stack: ["Next.js", "Postgres", "TypeScript"], posted: "5h ago", isNew: true },
  { id: "3", title: "Platform Engineer", company: "Kernel Works", location: "Singapore", remote: false, salary: "$7k - $10k / mo", stack: ["Go", "Kubernetes", "Terraform"], posted: "1d ago" },
  { id: "4", title: "Mobile Engineer", company: "Pocketwire", location: "Remote, APAC", remote: true, salary: "$3.5k - $5.5k / mo", stack: ["React Native", "TypeScript"], posted: "2d ago" },
  { id: "5", title: "Backend Engineer", company: "Lattice Pay", location: "Makati", remote: false, salary: "$4k - $6.5k / mo", stack: ["Node.js", "Postgres", "Redis"], posted: "3d ago" },
];
