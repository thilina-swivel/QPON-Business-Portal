import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const SLIDES = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1758520387682-1ae18d2ebc42?q=80&w=2532&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Give Your Team Everyday Savings",
    description: "Employees save on food, fuel, and groceries — for less than one team lunch per employee per month."
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1608222351212-18fe0ec7b13b?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Real-Time HR Analytics",
    description: "Track employee uptake, redemptions, and total savings — one dashboard, zero admin overhead."
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1610548822783-33fb5cb0e3a8?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Activate in Minutes",
    description: "No app download needed. Employees receive coupons instantly via SMS the moment you go live."
  }
];

export function AuthSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full bg-[#0E2250]">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-black/40 z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0E2250] via-transparent to-transparent z-10" />
          <img
            src={SLIDES[currentSlide].image}
            alt={SLIDES[currentSlide].title}
            className="w-full h-full object-cover"
          />
        </motion.div>
      </AnimatePresence>


      <div className="absolute bottom-0 left-0 right-0 p-12 z-20">
        <div className="max-w-lg">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">{SLIDES[currentSlide].title}</h2>
              <p className="text-lg text-blue-100 leading-relaxed opacity-90">
                {SLIDES[currentSlide].description}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="flex gap-2 mt-8">
            {SLIDES.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === currentSlide ? 'w-8 bg-[#C44500]' : 'w-2 bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
