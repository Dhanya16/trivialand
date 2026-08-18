import Link from "next/link";

type ButtonProps = {
  href?: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  type?: "button" | "submit";
  onClick?: () => void;
  className?: string;
};

export default function Button({
  href,
  children,
  variant = "primary",
  type = "button",
  onClick,
  className = "",
}: ButtonProps) {
  const classes =
    variant === "primary"
      ? `btn-primary inline-block ${className}`
      : `btn-secondary inline-block ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
