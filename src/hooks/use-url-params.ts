import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ProductFilters } from "@/types/global";

export function useUrlParams() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const getFiltersFromUrl = useCallback((): ProductFilters => {
    return {
      name: searchParams.get("name") || "",
      category: searchParams.get("category") || "",
      min_price: searchParams.get("min_price")
        ? parseFloat(searchParams.get("min_price")!)
        : undefined,
      max_price: searchParams.get("max_price")
        ? parseFloat(searchParams.get("max_price")!)
        : undefined,
      sortBy: searchParams.get("sortBy") || undefined,
      sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") || undefined,
      page: searchParams.get("page") ? parseInt(searchParams.get("page")!) : 1,
      limit: searchParams.get("limit")
        ? parseInt(searchParams.get("limit")!)
        : 10,
    };
  }, [searchParams]);

  const updateUrlParams = useCallback(
    (filters: Partial<ProductFilters>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.set(key, value.toString());
        } else {
          params.delete(key);
        }
      });

      if (!filters.hasOwnProperty("page")) {
        params.set("page", "1");
      }

      router.push(`?${params.toString()}`);
    },
    [router, searchParams]
  );

  return {
    getFiltersFromUrl,
    updateUrlParams,
  };
}
