import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const images = [
  '/src/assets/hero1.png',
  '/src/assets/hero2.png',
  '/src/assets/hero3.png',
  '/src/assets/hero4.png',
];

export default function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const currentImg = images[currentIndex];

  return (
    <section className="relative w-full min-h-screen flex flex-col lg:flex-row">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-[#0a3a40] z-0"></div>
      <div className="absolute top-0 right-0 w-full h-full overflow-hidden">
        <div className="absolute top-20 right-10 w-64 h-64 rounded-full bg-[#2a7d8c] opacity-20 blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-80 h-80 rounded-full bg-[#3c9aab] opacity-15 blur-3xl"></div>
      </div>
      
      {/* Left side: Image slider */}
      <div className="relative w-full lg:w-[40%] flex items-center justify-center py-10 lg:py-0 px-4 lg:px-0 z-10">
        <div className="relative w-full max-w-[500px] aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl">
          <AnimatePresence>
            <motion.img
              key={currentImg}
              src={currentImg}
              alt={`Fitness apparel - slide ${currentIndex + 1}`}
              className="absolute inset-0 w-full h-full object-cover"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
            />
          </AnimatePresence>
          
          {/* Progress indicators */}
          <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
            {images.map((_, index) => (
              <button 
                key={index} 
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'bg-white w-6' : 'bg-white/40'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Right side: Text content */}
      <div className="relative w-full lg:w-[60%] flex flex-col z-10">
        {/* Top text section */}
        <motion.div 
          className="flex-1 p-6 md:p-8 lg:p-12 flex flex-col justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="max-w-2xl">
            <div className="inline-block bg-[#2a7d8c] text-white px-4 py-2 rounded-full text-sm mb-4">
              Premium Fitness Wear
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 md:mb-6 leading-tight">
              Elevate Your <span className="text-[#3c9aab]">Workout</span> Wardrobe
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-6 md:mb-8 max-w-2xl">
              Discover premium fitness apparel designed for performance, comfort, and style. 
              Gear up for your best workout yet.
            </p>
            
            <ul className="space-y-3 mb-8 md:mb-12">
              {[
                "Moisture-Wicking Fabrics for All-Day Comfort",
                "Ergonomic Designs for Maximum Mobility",
                "Eco-Friendly Materials and Sustainable Production"
              ].map((item, index) => (
                <li key={index} className="flex items-start">
                  <div className="flex-shrink-0 mt-1 mr-3">
                    <div className="w-6 h-6 rounded-full bg-[#3c9aab] flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                  </div>
                  <span className="text-white text-base md:text-lg">{item}</span>
                </li>
              ))}
            </ul>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-[#3c9aab] hover:bg-[#2a7d8c] text-white font-medium py-3 px-8 rounded-full transition duration-300 transform hover:scale-105 shadow-lg">
                Shop Collection
              </button>
              <button className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-medium py-3 px-8 rounded-full transition duration-300">
                View New Arrivals
              </button>
            </div>
          </div>
        </motion.div>
        
        {/* Bottom text section */}
        <motion.div 
          className="flex-1 bg-[#0a3a40] bg-opacity-80 p-6 md:p-8 lg:p-12 flex flex-col justify-center text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="max-w-2xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">
              Why Shop With <span className="text-[#3c9aab]">BASE 97 </span>?
            </h2>
            <p className="text-gray-200 mb-6">
              We blend innovation and ethics to deliver workout gear that supports both your fitness goals and the planet.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: "Free Shipping",
                  description: "On orders over PKR 1500",
                  icon: (
                    <svg className="w-8 h-8 text-[#3c9aab]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                    </svg>
                  )
                },
                {
                  title: "Easy Returns",
                  description: "7-Day hassle-free returns",
                  icon: (
                    <svg className="w-8 h-8 text-[#3c9aab]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                    </svg>
                  )
                },
                {
                  title: "VIP Program",
                  description: "Exclusive commisions & perks",
                  icon: (
                    <svg className="w-8 h-8 text-[#3c9aab]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  )
                }
              ].map((item, index) => (
                <div key={index} className="flex flex-col items-center text-center bg-[#0e4a52] bg-opacity-50 p-5 rounded-xl backdrop-blur-sm">
                  <div className="mb-3">{item.icon}</div>
                  <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                  <p className="text-gray-300 text-sm">{item.description}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-8 flex items-center">
              <div className="flex -space-x-2 mr-4">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-[#0e4a52]"></div>
                ))}
              </div>
              <p className="text-sm text-gray-300">
                <span className="font-semibold text-white">5,000+</span> satisfied customers this month
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}