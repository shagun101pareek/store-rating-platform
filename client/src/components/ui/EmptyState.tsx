type Props = {
  title?: string;
  message?: string;
};

const EmptyState = ({
  title = "No data found",
  message = "There is nothing to display yet.",
}: Props) => {
  return (
    <div className="flex min-h-[160px] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
      <p className="text-base font-semibold text-slate-700">{title}</p>
      <p className="text-sm text-slate-500">{message}</p>
    </div>
  );
};

export default EmptyState;
