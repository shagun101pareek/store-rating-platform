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
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconBg}`}>
          {icon}
        </div>
        {trendUnavailable && (
          <div className="rounded-full bg-slate-50 px-2.5 py-1">
            <UnavailableData />
          </div>
        )}
      </div>
      <p className="mt-4 text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900">{value}</p>
      {subtitle && (
        <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
      )}
    </div>
  );
};

export default MetricCard;
