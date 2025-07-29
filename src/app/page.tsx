"use client"
import { useSession } from 'next-auth/react'
import React from 'react'

function Home() {
const session = useSession()
const user = session.data?.user

 console.log(user)
  return (
    <div>
      <h2>Next js 15</h2>
    {
      user? (
          <h1>Your Name Is {user?.name}</h1>
      ) : (
        <h1>Please Login</h1>
      )
    }
    </div>
  )
}

export default Home
