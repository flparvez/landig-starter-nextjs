// app/(admin)/page.tsx
import AdminNotificationButton from '@/components/admin/AdminNotificationButton'
import { DashboardCard } from '@/components/admin/DashboardCard'
import { RecentOrdersCard } from '@/components/admin/RecentOrdersCard'
import { SalesChartCard } from '@/components/admin/SalesChartCard'

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
      <div className="p-8">
          <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
          <p className="mb-6">
            Enable push notifications to get an alert for every new order.
          </p>
          <AdminNotificationButton />
        </div>
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