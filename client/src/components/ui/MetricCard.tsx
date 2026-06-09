import type { ReactNode } from "react";

type Props = {
  label: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  iconBg?: string;
};

const MetricCard = ({
  label,
  value,
  subtitle,
  icon,
  iconBg = "bg-slate-100 text-slate-500",
}: Props) => {
  return (
    <div className="min-w-0 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconBg}`}
      >
        {icon}
      </div>
      <p className="mt-4 text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
        {value}
      </p>
      {subtitle && (
        <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
      )}
    </div>
  );
};

export default MetricCard;
