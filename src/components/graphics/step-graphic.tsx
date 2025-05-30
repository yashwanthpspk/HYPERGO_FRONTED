import React from 'react';
import { motion } from 'framer-motion';

interface StepGraphicProps {
  step: number;
  totalSteps: number;
}

const StepGraphic: React.FC<StepGraphicProps> = ({ step, totalSteps }) => {
  const progress = (step / totalSteps) * 100;
  
  return (
    <div className="w-full max-w-md mx-auto mb-8">
      <div className="relative h-2 bg-default-200 rounded-full overflow-hidden">
        <motion.div 
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary-500 to-secondary-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>
      
      <div className="flex justify-between mt-2">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <motion.div 
            key={index}
            className={`flex flex-col items-center`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div 
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                index < step ? 'bg-success-500 text-white' : 
                index === step ? 'bg-primary-500 text-white' : 
                'bg-default-200 text-default-600'
              }`}
            >
              {index + 1}
            </div>
            <span className="text-xs mt-1 text-default-500">Step {index + 1}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default StepGraphic;