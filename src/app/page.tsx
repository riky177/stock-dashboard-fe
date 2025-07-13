import ProductTable from "@/components/product/product-table";
import { Suspense } from "react";

export default function Home() {
  return (
    <Suspense>
      <ProductTable />
    </Suspense>
  );
}
