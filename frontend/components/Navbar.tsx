import Link from "next/link";

const links = [
  { href: "/categories", label: "Categories" },
  { href: "/contests", label: "Contests" },
  { href: "/ai-quiz", label: "AI Quiz" },
  { href: "/discussions", label: "Discussions" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-[var(--bg)]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-4 sm:px-6">
        <Link
          href="/"
          className="shrink-0 text-lg font-bold tracking-tight text-[var(--text)] sm:text-xl"
        >
          Trivialand
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-[var(--text-muted)] transition-all duration-300 hover:bg-[var(--primary-light)] hover:text-[var(--primary)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <div className="relative hidden sm:block">
            <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-light)]" />
            <input
              type="search"
              placeholder="Search..."
              className="w-36 rounded-full border-0 bg-[var(--primary-light)]/60 py-2.5 pl-10 pr-4 text-sm outline-none transition-all duration-300 placeholder:text-[var(--text-light)] focus:bg-[var(--primary-light)] focus:ring-2 focus:ring-[var(--primary)]/20 lg:w-48"
            />
          </div>

          <Link
            href="/profile"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--primary)] text-sm font-semibold text-white shadow-md transition-all duration-300 hover:bg-[var(--primary-dark)] hover:scale-105"
            title="Profile"
          >
            P
          </Link>
        </div>
      </div>
    </header>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20L16 16" />
    </svg>
  );
}
