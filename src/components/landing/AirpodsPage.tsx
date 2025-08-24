'use client';
import { IProduct, IProductImage } from '@/models/Product'
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

import Link from 'next/link';
import { FaFacebookMessenger, FaWhatsapp, FaShoppingCart, FaCheckCircle, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { Image } from '@imagekit/next';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';

// Animation variants for Framer Motion
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

// --- Data and Reusable Components from AirPodsPage.tsx ---

const featureList = [
  'অ্যানসি ও টিআরএক্স টেকনোলজি',
  'অরিজিনাল মাইক্রোফোন কোয়ালিটি',
  'পারফেক্ট ফিট এন্ড কমফোর্টেবল',
  'অরিজিনাল সেম সাউন্ড কোয়ালিটি',
  'সহজে কানেক্ট করুন',
  'আইওএস এবং অ্যান্ড্রয়েড উভয় ডিভাইসে সাপোর্ট',
];

const sellingPoints = [
  '✅ অরিজিনাল সাউন্ড প্রপার্টিজ',
  '✅ ১০০% অ্যাডাপ্টিভ টিআরএক্স মোড',
  '✅ স্টোরেজ কেস ম্যাটেরিয়াল',
  '✅ অরিজিনাল ফিনিশিং এবং বডি',
];



// --- Data and Reusable Components from ReviewsPage.tsx ---

// Placeholder review data (replace with your actual data)
// const reviews = [
//   { id: 1, text: 'This is a great product! I am very satisfied with the quality.', img: '/path/to/review-1.png' },
//   { id: 2, text: 'Excellent service and the product is exactly as described.', img: '/path/to/review-2.png' },
//   { id: 3, text: 'The best master copy I have ever bought. Highly recommended.', img: '/path/to/review-3.png' },
//   { id: 4, text: 'Fast delivery and amazing quality. Unique Store BD is the best!', img: '/path/to/review-4.png' },
// ];



const ReviewSlider = ({reviews}: {reviews: IProductImage[]}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const reviewsCount = reviews.length;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % reviewsCount);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + reviewsCount) % reviewsCount);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000); // Auto-rotate every 5 seconds
    return () => clearInterval(interval);
  }, [currentSlide]);

  return (
    <div className="relative w-full overflow-hidden">
      <div 
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100 / reviewsCount}%)` }}
      >
        {reviews?.map((review) => (
          <div key={review.altText} className="min-w-full md:min-w-1/3 flex-shrink-0 p-2">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-lg shadow-md p-4"
            >
              <Image src={review.url} alt={`Review ${review.altText}`} width={400} height={400} layout="responsive" className="rounded-md" />
            </motion.div>
          </div>
        ))}
      </div>
      <button onClick={prevSlide} className="absolute left-0 top-1/2 -translate-y-1/2 p-2 bg-gray-800 bg-opacity-50 text-white rounded-full">
        <FaArrowLeft />
      </button>
      <button onClick={nextSlide} className="absolute right-0 top-1/2 -translate-y-1/2 p-2 bg-gray-800 bg-opacity-50 text-white rounded-full">
        <FaArrowRight />
      </button>
    </div>
  );
};

// --- Main Combined Page Component ---







const AirpodsPage = ({product}:{product: IProduct}) => {
            
const router = useRouter()
                  const { addToCart } = useCart();
const handleClick = (product: IProduct) => {
    addToCart({
      productId: product._id,
      name: product.name,
      image: product.images[0]?.url,
      price: product.price,
      quantity: 1,
    });
    router.push('/checkout');
  };


  const CallToActionButton = () => (
  <button onClick={() => handleClick(product)} >
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="w-full md:w-auto mt-6 py-3 px-8 text-lg font-bold text-white bg-red-600 rounded-lg shadow-lg hover:bg-red-700 transition-colors duration-300 flex items-center justify-center space-x-2"
    >
      <FaShoppingCart />
      <span>অর্ডার করতে চাই</span>
    </motion.button>
  </button>
);
  return (
 <div className="bg-gray-100 min-h-screen font-sans">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="max-w-4xl mx-auto p-4 md:p-8"
      >
        {/* Header Section (from AirPodsPage) */}
        <motion.header
          variants={itemVariants}
          className="text-center py-8 bg-white rounded-lg shadow-md"
        >
          <div className="flex justify-center mb-4">
            <FaShoppingCart className="text-red-600 text-5xl" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 leading-tight">
            সব থেকে সেরা AirPods Pro 2nd Gen প্রিমিয়াম দুবাই
          </h1>
          <p className="text-lg md:text-xl mt-2 text-gray-600">
            A1 Grade এর মাস্টারকপি!
          </p>
        </motion.header>

        {/* Product Feature Section (from AirPodsPage) */}
        <motion.section
          variants={itemVariants}
          className="mt-8 p-6 bg-white rounded-lg shadow-md"
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-full md:w-1/2">
              <Image
                src={product.images[0]?.url} // Replace with your image path
                alt="AirPods Pro 2nd Gen"
                width={500}
                height={500}
                layout="responsive"
                objectFit="contain"
                className="rounded-lg"
              />
            </div>
            <div className="w-full md:w-1/2">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                আনসিজ এবং টিআরএক্স বৈশিষ্ট্য
              </h2>
              <ul className="space-y-3 text-gray-700">
                {featureList.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <FaCheckCircle className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.section>

        {/* Introduction Section (from AirPodsPage) */}
        <motion.section
          variants={itemVariants}
          className="mt-8 p-6 bg-white rounded-lg shadow-md text-center"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            এটাই বাজেটের মধ্যে সব থেকে সেরা মাস্টার কপি?
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            এই কপি টি বাজারে থাকা অন্য সব সস্তা এবং চাইনিজ লোকাল কপি থেকে সম্পূর্ণ
            আলাদা। ১-৩ দিনের মধ্যে ডেলিভারি, এবং প্রতিটি অর্ডার এ থাকছে আকর্ষণীয় গিফট!
            আকর্ষণীয় অফার মূল্য {product.price}/= টাকা।
          </p>
          <CallToActionButton />
        </motion.section>

        {/* Customer Trust Section (from AirPodsPage) */}
        <motion.section
          variants={itemVariants}
          className="mt-8 p-6 bg-white rounded-lg shadow-md"
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-full md:w-1/2">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                এটাই সবথেকে বেস্ট A1 গ্রেড এর দুবাই মাস্টার কপি? এই বিষয় গুলো দেখলেই
                প্রমাণ পেয়ে যাবেন!
              </h2>
              <ul className="space-y-3 text-gray-700">
                {sellingPoints.map((point, index) => (
                  <li key={index} className="flex items-start">
                    <span className="flex-shrink-0">{point}</span>
                  </li>
                ))}
              </ul>
              <CallToActionButton />
            </div>
            <div className="w-full md:w-1/2">
              <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-lg">
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src="https://www.youtube.com/embed/your-youtube-video-id" // Replace with your YouTube video ID
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Comparison Section (from AirPodsPage) */}
        <motion.section
          variants={itemVariants}
          className="mt-8 p-6 bg-white rounded-lg shadow-md text-center"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            আমাদের প্রোডাক্ট এবং অন্য প্রোডাক্টের মধ্যে পার্থক্য কোথায়?
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            আমাদের প্রোডাক্টের প্রতিটি খুঁটিনাটি বিষয় এর উপর নজর রাখা হয়েছে, যাতে করে
            আপনি সেরা মানের একটি পণ্য পান। অন্যদের থেকে আমাদের পণ্য উন্নত এবং সাশ্রয়ী।
            আমরা গ্রাহকদের সন্তুষ্টি নিশ্চিত করি।
          </p>
          <CallToActionButton />
        </motion.section>

        {/* Contact Section (from ReviewsPage) */}
        <motion.section
          variants={itemVariants}
          className="text-center py-6"
        >
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
            আমাদের মেসেঞ্জারে ২৪ ঘন্টা প্রতিনিধি একটিভ থাক কোন সমস্যা হলে সাথে সাথে মেসেঞ্জারে মেসেজ করবেন।
          </h1>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <Link href="https://m.me/your-messenger-id" passHref>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="py-3 px-8 text-lg font-bold text-white bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center space-x-2"
              >
                <FaFacebookMessenger />
                <span>মেসেঞ্জারে</span>
              </motion.button>
            </Link>
            <Link href="https://wa.me/your-phone-number" passHref>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="py-3 px-8 text-lg font-bold text-white bg-green-600 rounded-lg shadow-lg hover:bg-green-700 transition-colors duration-300 flex items-center justify-center space-x-2"
              >
                <FaWhatsapp />
                <span>হোয়াটসঅ্যাপ</span>
              </motion.button>
            </Link>
          </div>
        </motion.section>

        {/* Testimonial Sections (from ReviewsPage) */}
        {Array.from({ length: 1 }).map((_, index) => (
          <motion.section
            key={index}
            variants={itemVariants}
            className="mt-8 p-6 bg-white rounded-lg shadow-md text-center"
          >
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
              কাস্টমার রিভিউ দেখলে বুজবেন প্রোডাক্টের কোয়ালিটি সব থেকে সেরা
            </h2>
            <ReviewSlider reviews={product.reviews} />
         
            <CallToActionButton />
          </motion.section>
        ))}

        {/* Footer (from AirPodsPage) */}
        <motion.footer
          variants={itemVariants}
          className="mt-8 text-center text-sm text-gray-500"
        >
          © 2025 Unique Store BD. All Rights Reserved.
        </motion.footer>
      </motion.div>
    </div>
  )
}

export default AirpodsPage








