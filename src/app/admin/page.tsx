// app/(admin)/page.tsx
import { DashboardCard } from '@/components/admin/DashboardCard'
import { RecentOrdersCard } from '@/components/admin/RecentOrdersCard'
import { SalesChartCard } from '@/components/admin/SalesChartCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  getTotalOrders, 
  getTotalProducts, 
  getTotalRevenue, 
  getTotalUsers,
  getPendingOrdersCount,
  getOutOfStockProductsCount,
  getRecentOrders,
  getSalesAnalytics
} from '@/lib/action'

export default async function AdminDashboard() {
  const [
    totalRevenue, 
    totalOrders, 
    totalProducts, 
    totalUsers,
    pendingOrders,
    outOfStockProducts,
    recentOrders,
    salesData
  ] = await Promise.all([
    getTotalRevenue(),
    getTotalOrders(),
    getTotalProducts(),
    getTotalUsers(),
    getPendingOrdersCount(),
    getOutOfStockProductsCount(),
    getRecentOrders(),
    getSalesAnalytics()
  ])

  // Format currency
  const formattedTotalRevenue = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'BDT',
    minimumFractionDigits: 2
  }).format(totalRevenue)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard Overview</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard 
          title="Total Revenue" 
          value={formattedTotalRevenue} 
          icon="dollar"
          description="All delivered orders"
        />
        <DashboardCard 
          title="Total Orders" 
          value={totalOrders.toString()} 
          icon="shopping-cart"
          description={`${pendingOrders} pending`}
        />
        <DashboardCard 
          title="Total Products" 
          value={totalProducts.toString()} 
          icon="package"
          description={`${outOfStockProducts} out of stock`}
        />
        <DashboardCard 
          title="Total Customers" 
          value={totalUsers.toString()} 
          icon="users"
          description="Registered users"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <RecentOrdersCard orders={recentOrders} />
        <SalesChartCard data={salesData} />
      </div>
    </div>
  )
}