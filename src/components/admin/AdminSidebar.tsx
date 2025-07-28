// components/AdminSidebar.tsx
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { LayoutDashboard, Package, ShoppingCart, Users } from 'lucide-react'

export function AdminSidebar() {
  return (
    <div className="hidden border-r bg-muted/40 md:block w-64">
      <div className="flex h-full flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px]">
          <Link href="/admin" className="flex items-center gap-2 font-semibold">
            <span>Admin Panel</span>
          </Link>
        </div>
        <div className="flex-1 p-4">
          <nav className="grid items-start gap-2">
            <Link href="/admin">
              <Button variant="ghost" className="w-full justify-start">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <Link href="/admin/products">
              <Button variant="ghost" className="w-full justify-start">
                <Package className="mr-2 h-4 w-4" />
                Products
              </Button>
            </Link>
            <Link href="/admin/orders">
              <Button variant="ghost" className="w-full justify-start">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Orders
              </Button>
            </Link>
            <Link href="/admin/users">
              <Button variant="ghost" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                Users
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </div>
  )
}