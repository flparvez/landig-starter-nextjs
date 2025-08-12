import OrderInformationPage from '@/components/OrderInformationPage'
import React from 'react'

const OrderConfirm = async ({
  params,
}: {
  params: Promise<{ id: string }>
}) => {
 const id = (await params).id
  const res  = await fetch(`https://landig-starter-nextjs.vercel.app/api/orders/${id}`)

  if (!res.ok) {
    throw new Error('Failed to fetch order confirmation')
  }
  const data = await res.json()
  console.log(data)
  return (
    <div>
      <OrderInformationPage order={data} />
    </div>
  )
}

export default OrderConfirm
