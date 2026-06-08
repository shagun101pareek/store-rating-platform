import { SortIcon } from "../icons";

type Props = {
  label: string;
  column: string;
  sortBy?: string;
  order?: "asc" | "desc";
  onSort: (column: string) => void;
};

const SortableTableHeader = ({
  label,
  column,
  sortBy,
  order,
  onSort,
}: Props) => {
  const isActive = sortBy === column;

  return (
    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 sm:px-6 sm:py-4">
      <button
        type="button"
        onClick={() => onSort(column)}
        className="inline-flex items-center gap-1 transition hover:text-slate-600"
      >
        {label}
        <SortIcon
          className={`h-3 w-3 ${isActive ? "text-blue-600" : "text-slate-300"}`}
        />
        {isActive && (
          <span className="sr-only">
            sorted {order === "asc" ? "ascending" : "descending"}
          </span>
        )}
      </button>
    </th>
  );
};

export default SortableTableHeader;
