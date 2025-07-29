import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import React from 'react'

function Home() {
  const session = getServerSession(authOptions)

  console.log("sesssion",session)
  return (
    <div>
      <h2>Next js 15</h2>
    </div>
  )
}

export default Home
