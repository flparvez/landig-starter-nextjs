// app/(admin)/layout.tsx
import  { authOptions }  from '@/lib/auth'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { AdminNavbar } from '@/components/admin/AdminNavbar'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // const session = await getServerSession(authOptions)

  // if (!session?.user) {
  //   redirect('/sign-in?error=Unauthorized')
  // }

  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        <AdminNavbar />
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}