import type { ReactNode } from "react";
import UnavailableData from "./UnavailableData";

type Props = {
  label: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  iconBg?: string;
  trendUnavailable?: boolean;
};

const MetricCard = ({
  label,
  value,
  subtitle,
  icon,
  iconBg = "bg-slate-100 text-slate-500",
  trendUnavailable = true,
}: Props) => {
  return (
    <div className="min-w-0 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconBg}`}
        >
          {icon}
        </div>
        {trendUnavailable && (
          <div className="hidden max-w-[9rem] shrink-0 rounded-full bg-slate-50 px-2.5 py-1 sm:block">
            <UnavailableData />
          </div>
        )}
      </div>
      <p className="mt-4 text-xs font-medium text-slate-500 sm:text-sm">{label}</p>
      <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
        {value}
      </p>
      {subtitle && (
        <p className="mt-1 text-xs text-slate-400 sm:text-sm">{subtitle}</p>
      )}
    </div>
  );
};

export default MetricCard;
