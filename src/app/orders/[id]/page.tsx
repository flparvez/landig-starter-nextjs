



import OrderInformationPage from '@/components/OrderInformationPage'
import { Metadata } from 'next'

import React from 'react'
export const metadata: Metadata = {
  title: 'Order Details',
  description: 'Order Details- Unique Store BD',
}
const OrderInfo =async ({
  params,
}: {
  params: Promise<{ id: string }>
}) => {
  const id = (await params).id
  const res = await fetch(`localhost:3000/api/orders/${id}`, {

    cache: 'force-cache',
  })
  const order = await res.json()

  return (
    <div className='mb-8'>
      
      <OrderInformationPage order={order}  />
    </div>
  )
}

export default OrderInfo