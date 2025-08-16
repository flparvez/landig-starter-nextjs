"use client"

import { useState } from "react"
import { ProductColumn } from "@/types/product"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Link from "next/link"
import { formatDate, formatCurrency } from "@/lib/utils"
import { FiTrash2 } from "react-icons/fi"
import { toast } from "sonner"

interface ProductsTableProps {
  data: ProductColumn[]
}

export const ProductsTable = ({ data }: ProductsTableProps) => {
 
  const [products, setProducts] = useState<ProductColumn[]>(data)

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return
toast("Deleting product...", {
      duration: 2000,
      description: "Please wait while we delete the product.",
    })
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      })

      if (!res.ok) throw new Error("Failed to delete product")

      // UI থেকে remove করা
      setProducts((prev) => prev.filter((p) => p._id !== id))
    } catch (error) {
      console.error("Delete failed:", error)
      alert("Failed to delete product")
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products?.length > 0 ? (
            products.map((product) => (
              <TableRow key={product._id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{formatCurrency(product.price)}</TableCell>
                <TableCell>
                  <Badge variant={product.stock > 0 ? "default" : "destructive"}>
                    {product.stock}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={product.featured ? "default" : "secondary"}>
                    {product.featured ? "Featured" : "Regular"}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(product.createdAt)}</TableCell>
                <TableCell className="text-right flex justify-end gap-2">
                  <Link href={`/admin/products/edit/${product._id}`}>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(product._id)}
                  >
                    Delete <FiTrash2 className="ml-1 h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No products found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
