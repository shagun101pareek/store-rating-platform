type Props = {
  message?: string;
  onRetry?: () => void;
};

const ErrorState = ({
  message = "Something went wrong. Please try again.",
  onRetry,
}: Props) => {
  return (
    <div className="flex min-h-[200px] flex-col items-center justify-center gap-4 rounded-xl border border-red-200 bg-red-50 p-8 text-center">
      <p className="text-sm font-medium text-red-700">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorState;
