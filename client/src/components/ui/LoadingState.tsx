type Props = {
  message?: string;
};

const LoadingState = ({ message = "Loading..." }: Props) => {
  return (
    <div className="flex min-h-[200px] flex-col items-center justify-center gap-3">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
      <p className="text-sm text-slate-500">{message}</p>
    </div>
  );
};

export default LoadingState;
