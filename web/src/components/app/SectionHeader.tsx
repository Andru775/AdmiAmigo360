import type { ReactNode } from "react";

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  action?: ReactNode;
};

export function SectionHeader({
  title,
  subtitle,
  action,
}: SectionHeaderProps) {
  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="text-base font-semibold text-white">{title}</h2>
        {subtitle ? (
          <p className="mt-1 text-sm leading-6 text-slate-400">{subtitle}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}
