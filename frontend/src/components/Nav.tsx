import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/ingest", label: "Ingest" },
  { href: "/analyze", label: "Analyze" },
];

export function Nav() {
  return (
    <header className="border-b border-zinc-800/80">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-sm font-semibold tracking-tight text-zinc-100">
          AI Job-Search Copilot
        </Link>
        <nav className="flex gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-zinc-400 transition-colors hover:text-zinc-100"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
