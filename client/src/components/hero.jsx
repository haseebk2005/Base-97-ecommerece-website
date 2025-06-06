import image1 from '../assets/hero1.png';
import image2 from '../assets/hero2.png';
import image3 from '../assets/hero3.png';
import image4 from '../assets/hero4.png';
import image5 from '../assets/hero.png';
import logo from '../assets/white_logo.png';
// src/components/HeroSection.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
export function HeroSection() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="relative overflow-hidden min-h-screen bg-cyan-200">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[rgba(34,47,57,0.8)] to-[rgba(64,79,89,0.6)] opacity-80"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,rgba(54,69,79,0)_70%)]"></div>
        
        {/* Floating circles */}
        <motion.div 
          className="absolute top-1/4 left-1/4 w-16 h-16 rounded-full bg-[rgba(255,255,255,0.5)]"
          animate={{ y: [0, -20, 0], x: [0, 15, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        ></motion.div>
        
        <motion.div 
          className="absolute top-1/3 right-1/4 w-12 h-12 rounded-full bg-[rgba(255,255,255,0.7)]"
          animate={{ y: [0, 15, 0], x: [0, -25, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        ></motion.div>
        
        <motion.div 
          className="absolute bottom-1/4 left-1/3 w-20 h-20 rounded-full bg-[rgba(255,255,255,0.4)]"
          animate={{ y: [0, -15, 0], x: [0, -10, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        ></motion.div>
      </div>

      {/* Hero Content */}
      <section className="relative z-10 flex flex-col lg:flex-row items-center justify-center min-h-screen py-8 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto mt-20">
        {/* Main Content - Left Side */}
        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start justify-center text-center lg:text-left max-w-3xl z-20 mb-12 lg:mb-0">
          {/* Logo */}
          <motion.div 
            className="mb-4 md:mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/">
              <img
                src={logo}
                alt="Logo"
                className="h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 lg:h-28 lg:w-28 rounded-full shadow-lg mx-auto lg:mx-0 transition-all duration-300 hover:scale-105"
              />
            </Link>
          </motion.div>

          {/* Heading */}
          <motion.h1 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold uppercase text-white mb-3 md:mb-4 drop-shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Elevate Your <span className="text-cyan-200">Performance</span>
          </motion.h1>

          {/* Subtext */}
          <motion.p 
            className="text-sm sm:text-base md:text-lg font-medium text-gray-100 max-w-2xl mb-6 md:mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Engineered for athletes who demand more. Experience seamless mobility and climate control with our next-generation fitness apparel collection.
          </motion.p>

          {/* Call to Action Buttons */}
          <motion.div 
            className="mt-4 md:mt-6 flex flex-wrap justify-center lg:justify-start gap-3 md:gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            
            <Link
              to="/blog"
              className="px-5 py-2.5 sm:px-6 sm:py-3 border-2 border-white text-white rounded-full font-semibold hover:bg-white/10 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
            >
              Learn More
            </Link>
          </motion.div>
        </div>

        {/* Image Gallery - Right Side (hidden on mobile)*/}
        {!isMobile && (
          <div className="w-full lg:w-1/2 flex items-center justify-center relative">
            <div className="relative w-full max-w-xl aspect-square">
              {/* Center Image */}
              <motion.div 
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
              >
                <img
                  src={image1}
                  alt="Center Feature"
                  className="w-64 h-64 object-cover rounded-xl shadow-2xl"
                />
              </motion.div>

              {/* Top Right Circle Image */}
              <motion.div 
                className="absolute top-[10%] right-[10%] z-20"
                initial={{ opacity: 0, x: 20, y: -20 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{ scale: 1.1 }}
              >
                <img
                  src={image2}
                  alt="Top Right Feature"
                  className="w-32 h-32 object-cover rounded-xl shadow-xl"
                />
              </motion.div>

              {/* Mid Left Circle Image */}
              <motion.div 
                className="absolute top-1/2 left-[5%] transform -translate-y-1/2 z-20"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                whileHover={{ scale: 1.1 }}
              >
                <img
                  src={image3}
                  alt="Mid Left Feature"
                  className="w-28 h-28 object-cover rounded-xl shadow-xl"
                />
              </motion.div>

              {/* Lower Right Image */}
              <motion.div 
                className="absolute top-[65%] right-[15%] transform -translate-y-1/4 z-30"
                initial={{ opacity: 0, x: 20, y: 20 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                whileHover={{ scale: 1.1 }}
              >
                <img
                  src={image4}
                  alt="Lower Right Feature"
                  className="w-32 h-32 object-cover rounded-xl shadow-xl"
                />
              </motion.div>

              {/* Below Center Image */}
              <motion.div 
                className="absolute left-1/2 bottom-[5%] transform -translate-x-1/2 z-20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                whileHover={{ scale: 1.05 }}
              >
                <img
                  src={image5}
                  alt="Bottom Feature"
                  className="w-64 h-20 object-cover rounded-xl shadow-xl"
                />
              </motion.div>
            </div>
          </div>
        )}
      </section>

      {/* Scroll indicator for desktop */}
      <motion.div 
        className="hidden lg:flex flex-col items-center absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <span className="mb-2 text-sm">Scroll down</span>
        <div className="w-1 h-8 bg-white rounded-full">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-1 h-13 bg-white rounded-full"
          ></motion.div>
        </div>
      </motion.div>
    </div>
  );
}
