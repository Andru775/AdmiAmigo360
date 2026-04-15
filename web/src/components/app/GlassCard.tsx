import type { HTMLAttributes, ReactNode } from "react";

type GlassCardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function GlassCard({
  children,
  className = "",
  ...props
}: GlassCardProps) {
  return (
    <div
      className={`app-glass-card rounded-[24px] border border-[var(--app-card-border)] bg-[var(--app-card)] shadow-[var(--app-shadow)] ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
