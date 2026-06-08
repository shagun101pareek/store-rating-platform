import type { ReactNode } from "react";

type Props = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
};

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
}: Props) => {
  if (totalPages <= 1) return null;

  const start = (currentPage - 1) * itemsPerPage + 1;
  const end = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = (): (number | "...")[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 3) {
      return [1, 2, 3, "...", totalPages];
    }
    if (currentPage >= totalPages - 2) {
      return [1, "...", totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, "...", currentPage, "...", totalPages];
  };

  return (
    <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-100 px-4 py-3 sm:flex-row sm:px-6 sm:py-4">
      <p className="text-sm text-slate-500">
        Showing {start} to {end} of {totalItems} results
      </p>
      <div className="flex items-center gap-1">
        <PageButton
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          ‹
        </PageButton>
        {getPageNumbers().map((page, index) =>
          page === "..." ? (
            <span key={`ellipsis-${index}`} className="px-2 text-slate-400">
              ...
            </span>
          ) : (
            <PageButton
              key={page}
              active={currentPage === page}
              onClick={() => onPageChange(page)}
            >
              {page}
            </PageButton>
          )
        )}
        <PageButton
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          ›
        </PageButton>
      </div>
    </div>
  );
};

type PageButtonProps = {
  children: ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

const PageButton = ({
  children,
  active = false,
  disabled = false,
  onClick,
}: PageButtonProps) => (
  <button
    type="button"
    disabled={disabled}
    onClick={onClick}
    className={`flex h-9 min-w-9 items-center justify-center rounded-lg text-sm font-medium transition ${
      active
        ? "bg-blue-600 text-white"
        : disabled
          ? "cursor-not-allowed text-slate-300"
          : "text-slate-600 hover:bg-slate-100"
    }`}
  >
    {children}
  </button>
);

export default Pagination;
