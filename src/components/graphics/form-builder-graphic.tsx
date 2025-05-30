import React from 'react';
import { motion } from 'framer-motion';

const FormBuilderGraphic: React.FC = () => {
  return (
    <div className="w-full max-w-md h-64 relative">
      <motion.div 
        className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg shadow-lg w-48 h-64"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="p-4">
          <div className="h-6 w-3/4 bg-white/20 rounded mb-3"></div>
          <div className="h-4 w-1/2 bg-white/20 rounded mb-6"></div>
          
          <div className="h-8 w-full bg-white/20 rounded mb-3"></div>
          <div className="h-8 w-full bg-white/20 rounded mb-3"></div>
          <div className="h-20 w-full bg-white/20 rounded mb-3"></div>
          
          <div className="flex justify-end">
            <div className="h-8 w-1/3 bg-white/40 rounded"></div>
          </div>
        </div>
      </motion.div>
      
      <motion.div 
        className="absolute top-8 right-8 bg-white rounded-lg shadow-lg w-48 h-40 border-2 border-primary-200"
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="p-3">
          <div className="h-5 w-3/4 bg-primary-100 rounded mb-2"></div>
          <div className="h-4 w-1/2 bg-primary-100 rounded mb-4"></div>
          
          <div className="h-6 w-full bg-primary-100 rounded mb-2"></div>
          <div className="h-6 w-full bg-primary-100 rounded"></div>
        </div>
      </motion.div>
      
      <motion.div 
        className="absolute bottom-8 left-8 bg-white rounded-lg shadow-lg w-36 h-32 border-2 border-secondary-200"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <div className="p-3">
          <div className="flex items-center mb-2">
            <div className="h-4 w-4 rounded-full bg-secondary-400 mr-2"></div>
            <div className="h-4 w-3/4 bg-secondary-100 rounded"></div>
          </div>
          <div className="flex items-center mb-2">
            <div className="h-4 w-4 rounded-full bg-secondary-300 mr-2"></div>
            <div className="h-4 w-3/4 bg-secondary-100 rounded"></div>
          </div>
          <div className="flex items-center">
            <div className="h-4 w-4 rounded-full bg-secondary-200 mr-2"></div>
            <div className="h-4 w-3/4 bg-secondary-100 rounded"></div>
          </div>
        </div>
      </motion.div>
      
      {/* Animated elements */}
      <motion.div 
        className="absolute top-16 left-16 h-6 w-6 rounded-full bg-success-400"
        animate={{ 
          y: [0, -10, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 2,
          ease: "easeInOut"
        }}
      />
      
      <motion.div 
        className="absolute bottom-16 right-16 h-4 w-4 rounded-full bg-warning-400"
        animate={{ 
          y: [0, 10, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 2.5,
          ease: "easeInOut",
          delay: 0.5
        }}
      />
      
      <motion.div 
        className="absolute top-32 right-32 h-5 w-5 rounded-full bg-primary-300"
        animate={{ 
          x: [0, 10, 0],
          opacity: [0.7, 1, 0.7],
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 3,
          ease: "easeInOut"
        }}
      />
    </div>
  );
};

export default FormBuilderGraphic;