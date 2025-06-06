import { motion } from 'framer-motion';

export default function CartItem({ item, removeItem, updateQty }) {
  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.3,
        staggerChildren: 0.1
      } 
    },
    exit: { 
      opacity: 0, 
      x: 50,
      transition: { 
        duration: 0.2,
        staggerChildren: 0.05,
        staggerDirection: -1
      } 
    }
  };

  const childVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, x: 20 }
  };

  return (
    <motion.div
      className="flex flex-col md:flex-row items-stretch bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mb-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {/* Product Image */}
      <motion.div
        className="md:w-1/4 bg-gray-100 flex items-center justify-center p-4"
        variants={childVariants}
      >
        <motion.img
          src={item.image}
          alt={item.name}
          className="h-40 w-full object-contain"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        />
      </motion.div>

      {/* Product Info */}
      <div className="flex-1 p-4 md:p-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="flex-1">
            <motion.h4
              className="text-lg font-bold text-gray-800 hover:text-[#3c9aab] transition-colors"
              variants={childVariants}
              whileHover={{ x: 3 }}
              transition={{ duration: 0.2 }}
            >
              {item.name}
            </motion.h4>
            
            <motion.div 
              className="mt-2 flex items-center"
              variants={childVariants}
            >
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg 
                    key={i}
                    className={`w-4 h-4 ${i < item.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-xs text-gray-500 ml-2">({item.reviews} reviews)</span>
            </motion.div>
            
            <motion.div 
              className="mt-4"
              variants={childVariants}
            >
              <span className="text-sm text-gray-500">Color:</span>
              <div className="flex items-center mt-1">
                <div 
                  className="w-6 h-6 rounded-full border border-gray-300 mr-2"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-gray-700">{item.colorName}</span>
              </div>
            </motion.div>
          </div>
          
          <div className="flex flex-col items-end">
            <motion.div
              className="text-xl font-bold text-[#3c9aab]"
              variants={childVariants}
            >
              PKR {item.price.toFixed(2)}
            </motion.div>
            
            <motion.div
              className="mt-2 text-sm text-gray-500 line-through"
              variants={childVariants}
            >
              PKR {(item.price * 1.2).toFixed(2)}
            </motion.div>
          </div>
        </div>

        {/* Quantity Selector */}
        <motion.div 
          className="mt-6 flex items-center justify-between"
          variants={childVariants}
        >
          <div className="flex items-center">
            <span className="text-gray-700 mr-3">Quantity:</span>
            <motion.div
              className="flex items-center border border-gray-300 rounded-lg overflow-hidden"
              whileHover={{ boxShadow: "0 0 0 2px #3c9aab" }}
            >
              <motion.button
                type="button"
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 transition-colors"
                onClick={() => updateQty(item.product, Math.max(1, item.qty - 1))}
                whileTap={{ scale: 0.95 }}
              >
                -
              </motion.button>
              
              <span className="px-3 py-1 w-12 text-center">{item.qty}</span>
              
              <motion.button
                type="button"
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 transition-colors"
                onClick={() => updateQty(item.product, Math.min(item.countInStock, item.qty + 1))}
                whileTap={{ scale: 0.95 }}
              >
                +
              </motion.button>
            </motion.div>
            
            <span className="text-sm text-gray-500 ml-3">
              {item.countInStock} in stock
            </span>
          </div>
          
          <motion.button
            onClick={() => removeItem(item.product)}
            className="flex items-center text-red-600 hover:text-red-800 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 mr-1" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
              />
            </svg>
            Remove
          </motion.button>
        </motion.div>
      </div>
      
      {/* Mobile Actions */}
      <motion.div 
        className="md:hidden bg-gray-50 p-4 flex justify-between border-t border-gray-200"
        variants={childVariants}
      >
        <div className="flex items-center">
          <span className="text-gray-700 mr-2">Total:</span>
          <span className="font-bold text-[#3c9aab]">
            PKR {(item.price * item.qty).toFixed(2)}
          </span>
        </div>
        <button 
          className="px-4 py-2 bg-[#3c9aab] text-white rounded-lg hover:bg-[#2a7d8c] transition"
          onClick={() => console.log("Save for later")}
        >
          Save for later
        </button>
      </motion.div>
    </motion.div>
  );
}