import { GlassCard } from "@/components/app/GlassCard";
import { Icon } from "@/components/app/Icon";

type StatCardProps = {
  label: string;
  value: string;
  detail: string;
  icon: string;
  iconClassName: string;
  trendClassName: string;
};

export function StatCard({
  label,
  value,
  detail,
  icon,
  iconClassName,
  trendClassName,
}: StatCardProps) {
  return (
    <GlassCard className="relative overflow-hidden p-5">
      <div className="absolute -right-4 -top-5 h-24 w-24 rounded-full bg-white/5" />
      <div className="relative flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-2xl ${iconClassName}`}
          >
            <Icon name={icon} className="text-[1.3rem]" />
          </div>
          <span
            className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${trendClassName}`}
          >
            {detail}
          </span>
        </div>
        <div>
          <p className="text-sm text-slate-400">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
        </div>
      </div>
    </GlassCard>
  );
}
