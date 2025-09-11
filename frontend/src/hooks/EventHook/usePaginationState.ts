import { useState } from "react";

export function usePaginationState(initialPage = 1, initialLimit = 20) {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  return { page, setPage, limit, setLimit } as const;
}
