import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Footer from '/src/components/Footer.jsx'
// Import images
import runningImg from '../assets/running.png';
import yogaImg from '../assets/yoga.png';
import outdoorImg from '../assets/outdoor.png';
import blog1 from '../assets/blog-1.jpg';
import blog2 from '../assets/blog-2.jpg';
import blog3 from '../assets/blog-3.jpg';
import blog4 from '../assets/blog-4.jpg';
import blog5 from '../assets/blog-5.jpg';
import blog6 from '../assets/blog-6.jpg';

const BlogPage = () => {
  const products = [
    { id: 1, title: 'Performance Running Gear', image: runningImg, category: 'Performance', date: 'May 15, 2023', readTime: '5 min read' },
    { id: 2, title: 'Yoga Collection', image: yogaImg, category: 'Lifestyle', date: 'Apr 28, 2023', readTime: '4 min read' },
    { id: 3, title: 'Outdoor Adventures', image: outdoorImg, category: 'Outdoor', date: 'Jun 2, 2023', readTime: '6 min read' },
    { id: 4, title: 'Swimwear Technology', image: blog4, category: 'Performance', date: 'May 22, 2023', readTime: '7 min read' },
    { id: 5, title: 'Gym Essentials', image: blog5, category: 'Training', date: 'Apr 10, 2023', readTime: '4 min read' },
    { id: 6, title: 'Recovery Wear', image: blog6, category: 'Recovery', date: 'Jun 8, 2023', readTime: '5 min read' },
  ];

  const blogPosts = [
    { id: 1, title: 'The Science of Moisture-Wicking Fabrics', excerpt: 'Discover how our fabrics keep you dry during intense workouts.', category: 'Technology', image: blog1, src:'https://en.wikipedia.org/wiki/Moisture_management' },
    { id: 2, title: 'Top 10 Running Tips for Beginners', excerpt: 'Start your running journey with expert advice from professional athletes.', category: 'Training', image: blog2, src:'https://en.wikipedia.org/wiki/Running' },
    { id: 3, title: 'Sustainable Sportswear: Our Commitment', excerpt: 'Learn about our eco-friendly manufacturing processes and materials.', category: 'Sustainability', image: blog3, src:'https://en.wikipedia.org/wiki/Sustainable_fashion' },
  ];

  const heroImages = [blog1, blog2, blog3, blog4, blog5];
  const sliderImages = [blog1, blog2, blog3, blog4, blog5, blog6];

  return (
    <div className="min-h-screen mt-10 bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 md:py-24 flex flex-col lg:flex-row items-center">
        <div className="lg:w-1/2 mb-12 lg:mb-0 lg:pr-10">
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Elevate Your Game with <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-teal-500">Premium Sportswear</span>
          </motion.h1>
          
          <motion.p 
            className="text-xl text-gray-300 mb-8 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Discover high-performance apparel designed for champions. Experience unmatched comfort and style in every stitch.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link 
              to="/" 
              className="inline-block bg-gradient-to-r from-cyan-600 to-teal-600 text-white px-8 py-4 rounded-full font-bold hover:opacity-90 transition-all shadow-lg hover:shadow-xl"
            >
              Shop Collection
            </Link>
          </motion.div>
        </div>

        <div className="lg:w-1/2 relative h-80 md:h-96 lg:h-[500px] w-full">
          <div className="relative w-full h-full">
            {heroImages.map((img, index) => (
              <motion.div 
                key={index}
                className={`absolute rounded-xl overflow-hidden shadow-xl transition-all duration-500 hover:z-10 ${
                  index === 0 ? 'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3/5 h-3/5 z-10' :
                  index === 1 ? 'left-0 top-0 w-2/5 h-2/5 z-0' :
                  index === 2 ? 'right-0 top-0 w-2/5 h-2/5 z-0' :
                  index === 3 ? 'left-0 bottom-0 w-2/5 h-2/5 z-0' :
                  'right-0 bottom-0 w-2/5 h-2/5 z-0'
                }`}
                whileHover={{ scale: 1.05, zIndex: 20 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <img 
                  src={img} 
                  alt={`Sportswear ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Infinite Image Slider */}
      <section className="py-12 bg-gradient-to-r from-gray-800 to-gray-900 overflow-hidden">
        <div className="relative flex">
          <div className="flex animate-marquee whitespace-nowrap">
            {sliderImages.map((img, idx) => (
              <motion.div 
                key={`first-${idx}`}
                className="mx-4 w-64 h-64 rounded-xl overflow-hidden flex-shrink-0"
                whileHover={{ scale: 1.05 }}
              >
                <img 
                  src={img} 
                  alt={`Slide ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            ))}
          </div>
          
          <div className="flex absolute top-0 animate-marquee2 whitespace-nowrap">
            {sliderImages.map((img, idx) => (
              <motion.div 
                key={`second-${idx}`}
                className="mx-4 w-64 h-64 rounded-xl overflow-hidden flex-shrink-0"
                whileHover={{ scale: 1.05 }}
              >
                <img 
                  src={img} 
                  alt={`Slide ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Latest in Sportswear Technology
          </motion.h2>
          
          <motion.p 
            className="text-xl text-gray-300 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Stay updated with the latest innovations and trends in performance sportswear
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <motion.div 
              key={product.id}
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
            >
              <div className="h-64 overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="px-3 py-1 bg-cyan-600 rounded-full text-sm font-medium">
                    {product.category}
                  </span>
                  <div className="text-gray-400 text-sm">
                    {product.date} • {product.readTime}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold mb-3">{product.title}</h3>
                <p className="text-gray-300 mb-5">
                  Explore our innovative fabric technology that enhances performance and keeps you comfortable during intense workouts.
                </p>
                
                
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Popular Blog Posts */}
      <section className="bg-gradient-to-r from-gray-800 to-gray-900 py-16">
        <div className="container mx-auto px-4">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Popular Blog Posts
          </motion.h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {blogPosts.map((post, index) => (
              <motion.div 
                key={post.id}
                className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl overflow-hidden shadow-xl"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="h-48 overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <span className="px-3 py-1 bg-teal-600 rounded-full text-sm font-medium">
                      {post.category}
                    </span>
                    <div className="ml-4 h-2 w-2 bg-gray-500 rounded-full"></div>
                    <span className="ml-4 text-gray-400">Jun 12, 2023</span>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3">{post.title}</h3>
                  <p className="text-gray-300 mb-5">{post.excerpt}</p>
                  <a href={post.src}>
                  <button className="text-cyan-400 font-medium flex items-center">
                    Continue Reading
                    <svg 
                      className="ml-2" 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      
      <Footer/>
      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-100%); }
        }
        
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
        
        @keyframes marquee2 {
          0% { transform: translateX(100%); }
          100% { transform: translateX(0%); }
        }
        
        .animate-marquee2 {
          animation: marquee2 20s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default BlogPage;