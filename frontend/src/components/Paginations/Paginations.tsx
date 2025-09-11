import { toPersianDigits } from "../../utils/numberConvert";

interface Props {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (p: number) => void;
  onPageSizeChange: (size: number) => void;
  classNames?: string;
  rowPageClassNames?: string;
  showRowPage?: boolean;
}

export default function Pagination({
  currentPage,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  classNames,
  rowPageClassNames,
  showRowPage = true,
}: Props) {
  return (
    <div
      className={`${classNames} w-full flex items-center justify-between py-2 px-6 flex-row-reverse`}
    >
      <div className="w-fit flex justify-between items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`
    btn-sm
    ${
      currentPage === 1
        ? "bg-gray-300 text-gray-500 cursor-not-allowed px-2 py-1 text-sm rounded-md"
        : "bg-[#09a1a4] text-white hover:bg-[#088f90] px-2 py-1 text-sm rounded-md"
    }
  `}
        >
          قبل
        </button>

        <span className="w-fit">
          {toPersianDigits(currentPage)} از {toPersianDigits(totalItems)}
        </span>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalItems}
          className={`
    btn-sm
    ${
      currentPage >= totalItems
        ? "bg-gray-300 text-gray-500 cursor-not-allowed px-2 py-1 text-sm rounded-md"
        : "bg-[#09a1a4] text-white hover:bg-[#088f90] px-2 py-1 text-sm rounded-md"
    }
  `}
        >
          بعد
        </button>
      </div>

      {showRowPage && (
        <div className={`${rowPageClassNames} flex items-center space-x-2`}>
          <span>تعداد سطر‌ها:</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(+e.target.value)}
            className="form-select"
          >
            {[10, 20, 50, 100].map((n) => (
              <option key={n} value={n}>
                {toPersianDigits(n)}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
