import Link from "next/link";

const footerLinks = [
  {
    title: "Explore",
    links: [
      { href: "/categories", label: "Categories" },
      { href: "/contests", label: "Contests" },
      { href: "/ai-quiz", label: "AI Quiz Generator" },
    ],
  },
  {
    title: "Community",
    links: [
      { href: "/discussions", label: "Discussions" },
      { href: "/profile", label: "Profile" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative bg-transparent">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
          <div>
            <p className="text-lg font-bold tracking-tight text-[var(--text)]">Trivialand</p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-[var(--text-muted)]">
              Learn through levels, compete in contests, and generate AI quizzes.
            </p>
          </div>

          {footerLinks.map((group) => (
            <div key={group.title}>
              <p className="text-sm font-semibold text-[var(--text)]">{group.title}</p>
              <ul className="mt-3 space-y-2.5 text-sm text-[var(--text-muted)]">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="transition-colors duration-300 hover:text-[var(--primary)]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-12 text-center text-xs text-[var(--text-light)]">
          © {new Date().getFullYear()} Trivialand
        </p>
      </div>
    </footer>
  );
}
