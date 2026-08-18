type GlassCardProps = {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
};

export default function GlassCard({ children, className = "", hover = false }: GlassCardProps) {
  return (
    <div className={`card-light p-4 sm:p-5 ${hover ? "card-interactive" : ""} ${className}`}>
      {children}
    </div>
  );
}
