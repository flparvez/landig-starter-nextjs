// app/(admin)/layout.tsx

import { AdminSidebar } from '@/components/admin/AdminSidebar'

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
    <div className="flex min-h-screen w-full bg-muted/40">
      <AdminSidebar />
      <div className="flex flex-1 flex-col">
        <AdminNavbar />
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}