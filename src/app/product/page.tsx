import ProductTable from "@/components/product/product-table";
import { Suspense } from "react";

export default function ProductPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductTable />
    </Suspense>
  );
}
