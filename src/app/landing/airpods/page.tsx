
import AirpodsPage from '@/components/landing/AirpodsPage'
import React from 'react'


const Landing = async () => {
  const res = await fetch('https://landig-starter-nextjs.vercel.app/api/products/68ab4a3bf07c49ae82eb0193', {
    next: { revalidate: 60 },
  })
  const product = await res.json()

  return (
 <main>
  <AirpodsPage product = {product?.product} />
 </main>
  )
}

export default Landing
