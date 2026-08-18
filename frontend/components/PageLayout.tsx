import Footer from "./Footer";

type PageLayoutProps = {
  title?: string;
  subtitle?: string;
  visual?: React.ReactNode;
  children: React.ReactNode;
  fullWidth?: boolean;
};

export default function PageLayout({
  title,
  subtitle,
  visual,
  children,
  fullWidth = false,
}: PageLayoutProps) {
  return (
    <div className="page-bg">
      <div className="relative z-10 mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        {title && (
          <div className="mb-10">
            <h1 className="text-3xl font-semibold tracking-tight text-[var(--text)] sm:text-4xl">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-3 text-base text-[var(--text-muted)]">{subtitle}</p>
            )}
          </div>
        )}

        {fullWidth || !visual ? (
          children
        ) : (
          <div className="grid items-start gap-10 lg:grid-cols-[1fr_280px] lg:gap-14">
            <div>{children}</div>
            <div className="hidden lg:block">{visual}</div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
