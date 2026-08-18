import Link from "next/link";

type GradientCardProps = {
  href?: string;
  title: string;
  subtitle?: string;
  disabled?: boolean;
  className?: string;
};

export default function GradientCard({
  href,
  title,
  subtitle,
  disabled = false,
  className = "",
}: GradientCardProps) {
  const content = (
    <>
      <p className="text-lg font-medium tracking-tight text-[var(--text)]">{title}</p>
      {subtitle && (
        <p className="mt-1.5 text-sm leading-relaxed text-[var(--text-muted)]">{subtitle}</p>
      )}
    </>
  );

  const baseClass = `card-light flex min-h-[128px] flex-col items-center justify-center px-5 py-7 text-center sm:min-h-[140px] sm:px-6 sm:py-8 ${className}`;

  if (disabled || !href) {
    return <div className={`${baseClass} cursor-not-allowed opacity-50`}>{content}</div>;
  }

  return (
    <Link href={href} className={`${baseClass} card-interactive`}>
      {content}
    </Link>
  );
}
