import { getProducts } from "@/lib/action"
import { Button } from "@/components/ui/button"
import { ProductsTable } from "@/components/admin/products-table"
import Link from "next/link"
import { Pagination } from "@/components/admin/pagination"

export default async function ProductsPage({

}) {
  const page = 1;
  const { products, totalPages } = await getProducts()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link href="/admin/products/new">
          <Button>Add Product</Button>
        </Link>
      </div>

      <ProductsTable data={products} />

      {totalPages > 1 && (
        <Pagination 
          currentPage={page} 
          totalPages={totalPages} 
          className="mt-4"
        />
      )}
    </div>
  )
}