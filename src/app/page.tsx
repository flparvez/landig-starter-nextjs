import Home from '@/components/Home';
import Link from 'next/link';
import React from 'react';

const HomePage = async () => {
  try {
    const response = await fetch('https://landig-starter-nextjs.vercel.app/api/products', {
      next: { revalidate: 60 }, // revalidate every 60s
      cache: 'force-cache',     // or 'no-store' if you want fresh data every time
    });

    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }

    const data = await response.json();

    return (
      <div>
        {/*  link of page */}
<h2>Landing Page link</h2>
        <div>
          <Link className='p-4 text-xl' href="/landing/airpods">Airpods</Link>
        </div>
        <Home products={data?.products || []} />
      </div>
    );
  } catch (error) {
    console.error('❌ HomePage fetch error:', error);
    return (
      <div className="text-red-500 p-6">
        ⚠️ Could not load products. Please try again later.
      </div>
    );
  }
};

export default HomePage;
