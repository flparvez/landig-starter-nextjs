
import React from 'react'

import LandingPage from '@/components/landing/LandingPage'

const Landing = async () => {
  const res = await fetch('https://landig-starter-nextjs.vercel.app/api/products/6898b8dadf8680e054da635f', {
    next: { revalidate: 60 },
  })
  const product = await res.json()

  return (
 <main>
  <LandingPage product = {product?.product} />
 </main>
  )
}

export default Landing
