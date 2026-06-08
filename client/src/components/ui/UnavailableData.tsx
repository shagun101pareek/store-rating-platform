type Props = {
  className?: string;
};

const UnavailableData = ({ className = "" }: Props) => {
  return (
    <span className={`text-xs italic text-slate-400 ${className}`}>
      Data unavailable from current API
    </span>
  );
};

export default UnavailableData;
