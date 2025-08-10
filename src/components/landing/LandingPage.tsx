
"use client"
import logo from '../../../public/modina_sebagor.jpg'

import React from 'react'
import Image from 'next/image'
import { IProduct } from '@/models/Product'
import { useCart } from '@/hooks/useCart'
import { useRouter } from 'next/navigation'

const LandingPage = ({product}: {product: IProduct}) => {


const router = useRouter()
                  const { addToCart } = useCart();
const handleClick = (product: IProduct) => {
    addToCart({
      productId: product._id.toString(),
      name: product.name,
      image: product.images[0]?.url,
      price: product.price,
      quantity: 1,
    });
    router.push('/checkout');
  };
                return (
                            <main>

{/* Bannar */}
  <div className="bg-[#0b1a4b] flex flex-col items-center justify-center py-8 px-4">
      {/* Logo */}
     
      <Image src={logo} alt="Cool Stone Logo" className="mb-4 w-28 md:w-32" />

      {/* Green Highlight Box */}
      <div className="bg-green-700 text-white font-bold text-center px-6 py-4 rounded-md border border-white shadow-lg max-w-4xl text-lg md:text-xl">
        ৯৯% আয়রন মুক্ত বিশুদ্ধ ঠাণ্ডা পানি, মোজাইক পাথরের ফিল্টারেই আপনার আস্থা।
      </div>

      {/* Order Button */}
      <button    onClick={() => handleClick(product)} className="mt-6 bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-6 py-2 rounded shadow-md border border-black transition">
        ☑ অর্ডার করতে চাই
      </button>
    </div>


{/* Mosaic Filter Benefits */}
         <div className="bg-white py-6 px-4 md:px-8 lg:px-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        
        {/* Left Content */}
        <div>
          {/* Title */}
          <h2 className="bg-blue-600 text-white text-lg md:text-xl font-bold py-3 px-4 rounded-md">
            কেন মোজাইক পাথরের ফিল্টার ব্যবহার করবেন?
          </h2>

          {/* Bullet Points */}
          <ul className="mt-4 space-y-3 text-gray-800 text-sm md:text-base">
            {[
              "আয়রন ও ময়লামুক্ত – ৯৯% পর্যন্ত আয়রন ফিল্টার করে",
              "বাজারের ঠান্ডা পানি – বিদ্যুৎ বা গ্যাস ছাড়া",
              "গন্ধহীন সেরা জল – প্রাকৃতিক উপাদান দিয়ে তৈরি ফিল্টারেশন",
              "পরিবারের জন্য নিরাপদ – শিশু এবং বৃদ্ধ সবার জন্য উপযোগী",
              "শক্তিশালী ও পরিবেশবান্ধব – প্রাকৃতিক পাথর, পুনর্ব্যবহারযোগ্য",
              "ব্যবহার সহজ – ৫ মিনিটে সেটআপ (বিদ্যমান ফিল্টারে ফিট, পরিবর্তনের প্রয়োজন নেই)",
              "ফুল ফ্লো এবং দীর্ঘস্থায়ী পরিষেবা",
              "পানির স্বাদ উন্নত – শীতল ও সতেজ স্বাদ পাবেন",
              "দীর্ঘমেয়াদে অর্থ সাশ্রয় হবে"
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-orange-500 text-lg">✔</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          {/* Button */}
          <button    onClick={() => handleClick(product)} className="mt-6 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2 rounded shadow transition">
            অর্ডার করতে ক্লিক করুন
          </button>
        </div>

        {/* Right Image */}
        <div className="flex justify-center">
          <img
            src="https://zamzamdara.xyz/wp-content/uploads/elementor/thumbs/Mosaic-stone-filter-modina-r77gqimu0n827s9ony5hd4b74ow63fqk2d53mi4064.webp" // Replace with your image path
            alt="মোজাইক পাথরের ফিল্টার"
         
            className="rounded-lg shadow-lg"
          />
        </div>

      </div>
    </div>




      {/* <FilterOfferSection />
      
      
  */}


<div className="bg-white py-6 px-4 md:px-8 lg:px-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-start">

        {/* Left Section */}
        <div>
          {/* Top Title Row */}
          <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
            <h2 className="bg-blue-600 text-white text-sm md:text-base font-bold py-2 px-4 rounded">
              ফিল্টারের ব্যবহার পদ্ধতি:
            </h2>
            <h3 className="bg-blue-200 text-blue-900 text-sm md:text-base font-bold py-2 px-4 rounded">
              প্রিমিয়াম মোজাইক পাথরের ওয়াটার ফিল্টার
            </h3>
          </div>

          {/* Bullet Points */}
          <ul className="space-y-3 text-gray-800 text-sm md:text-base">
            {[
              "আয়রন, আর্সেনিকের টেস্টেডমিনেশন ফিল্টারটি A to Z সম্পূর্ণ স্টেরিলাইজ করে নিন।",
              "ফিল্টারটি, বিদ্যমান কনটেইনারের সাথে মিলে যাবে, অতিরিক্ত কিছু কেনার প্রয়োজন নেই।",
              "প্রতিদিন পানির স্বাদ ভালো রাখে, কোন গন্ধ বা অশুদ্ধি ছাড়া পানির নিশ্চয়তা দেয়।",
              "প্রতি ফিল্টার ২-৩ বছর পর্যন্ত স্থায়ী হয়।",
              "প্রতিটি ফিল্টার ৬ মাস অন্তর পরিষ্কার করুন, যাতে দীর্ঘস্থায়ী কার্যকারিতা বজায় থাকে।",
              "বিশুদ্ধকরণের সময় কম লাগে এবং দ্রুত নির্ভরযোগ্য পানি সরবরাহ করে।"
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-orange-500 text-lg">✔</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Section - Image */}
        <div className="flex justify-center">
          <img
            src="https://zamzamdara.xyz/wp-content/uploads/2025/05/Mosaic-stone-filter-165x300.webp" // Change to your image path
            alt="প্রিমিয়াম মোজাইক পাথরের ওয়াটার ফিল্টার"
            width={300}
            height={400}
            className="rounded-lg shadow-lg object-cover"
          />
        </div>
      </div>

      {/* Offer Box */}
      <div className="mt-8 border-2 border-dashed border-blue-400 p-4 md:p-6 rounded-lg bg-orange-50 text-center max-w-4xl mx-auto">
        <h3 className="text-lg md:text-xl font-bold text-orange-900 mb-4">
          আমাদের ফিল্টারের সাথে এই সপ্তাহে বর্তমান অফারে যা যা থাকছে।
        </h3>

        {/* Offer List */}
        <ul className="space-y-2 text-gray-700 text-sm md:text-base mb-4">
          <li>✔ সম্পূর্ণ ফ্রি হোম ডেলিভারি</li>
          <li>✔ বিনামূল্যে টেস্টিং (ফ্রি)</li>
          <li>✔ প্রথম দিন থেকেই সঠিকভাবে চলবে তা নিশ্চিত করা হবে</li>
        </ul>

        {/* Price */}
        <div className="text-red-600 text-lg md:text-xl font-bold mb-2">
          অফার মূল্য ৩৫০০ টাকা
        </div>

        <p className="text-sm md:text-base text-gray-700 mb-4">
          অফারটি সীমিত সময়ের জন্য <br /> (বিক্রয় ও পরিষেবার গুণগত মানের গ্যারান্টি)
        </p>

        {/* Order Button */}
        <button    onClick={() => handleClick(product)} className="bg-black hover:bg-gray-800 text-white px-6 py-2 rounded font-semibold shadow-md transition">
          অর্ডার করতে ক্লিক করুন
        </button>
      </div>

      {/* Footer Text */}
      <p className="mt-6 text-center text-sm text-gray-700">
        বাংলাদেশে আমরাই একমাত্র প্রতিষ্ঠান, যারা ১০০% গ্যারান্টিসহ অরিজিনাল মোজাইক পাথরের ফিল্টার সরবরাহ করে আসছি।
        আমাদের দীর্ঘ অভিজ্ঞতা ও গুণগত মানের অনন্য সেবা গ্রাহকদের সন্তুষ্টি দেয়।
      </p>
    </div>




      {/* <WaterDiseaseHistorySection /> */}

      <div className="bg-white py-6 px-4 md:px-8 lg:px-12">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Disease Section */}
        <div className="bg-green-800 text-white rounded-lg shadow-md p-4 text-center font-bold text-lg md:text-xl">
          বিশুদ্ধ পানির অভাবে যেসব পানিবাহিত রোগ হয়।
        </div>

        {/* Two Column List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-green-900 text-sm md:text-base font-medium">
          <ul className="space-y-2">
            {[
              "চুলকানি।",
              "চর্মরোগ (স্কিন ইনফেকশন)।",
              "পেটে ব্যথা।",
              "হজমে সমস্যা।",
              "খাদ্যে অরুচি।",
              "ডায়রিয়া, আমাশয়া।"
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-green-600 text-lg">✔</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <ul className="space-y-2">
            {[
              "শিশুদের বৃদ্ধি বন্ধ হয়ে যাওয়া।",
              "রোগ প্রতিরোধ ক্ষমতা হ্রাস।",
              "দুর্বলতা ও ক্লান্তি।",
              "কিডনি ড্যামেজ।",
              "লিভার ফাংশন ব্যর্থতা।",
              "টাইফয়েড।"
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-green-600 text-lg">✔</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* History Section */}
        <div className="bg-green-800 text-white rounded-lg shadow-md p-4 text-center font-bold text-lg md:text-xl">
          মোজাইক পাথরের ফিল্টারের ইতিহাস
        </div>

        {/* History Content */}
        <div className="bg-blue-900 text-white p-6 rounded-lg shadow-lg text-center space-y-4">
          <p className="text-sm md:text-base leading-relaxed">
            এই মোজাইক পাথরের ফিল্টারটি ১৯৪৭ সাল থেকে এর ব্যবহার শুরু হয়েছে।
            তৎকালীন যুগে এটি রাজা বাদশারা ব্যবহার করতেন। এই ফিল্টারটি অনেক আগে থেকে ব্যবহার হলেও
            এটি অনেক ভারি হওয়ার কারণে সবার কাছে পৌঁছাতে পারেনি।
          </p>

          {/* Order Button */}
          <button    onClick={() => handleClick(product)} className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-6 py-2 rounded shadow-lg transition">
            ☑ অর্ডার করুন
          </button>
        </div>

      </div>
    </div>
    </main>
                )
}

export default LandingPage
