import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Building2, Users, Zap } from 'lucide-react';
import { Button } from './ui/button';

interface OnboardingGuideProps {
  isOpen: boolean;
  onClose: () => void;
  onWatchVideo: () => void;
}

export function OnboardingGuide({ isOpen, onClose }: OnboardingGuideProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white dark:bg-[#141414] rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Welcome Header */}
          <div className="bg-[#0E2250] p-6 text-white text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#C44500] rounded-full blur-3xl opacity-30 -mr-10 -mt-10" />
            <div className="relative z-10">
              <h2 className="text-xl font-bold mb-1">Welcome to QPON Business</h2>
              <p className="text-blue-200 text-xs mx-auto">Set up your business portal and start saving for your team.</p>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); onClose(); }}
              className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Steps */}
          <div className="p-5 space-y-5">
            <div className="space-y-4">
              <GuideStep
                step={1}
                icon={Building2}
                title="Complete Company Profile"
                description="Add your company details and HR manager info"
                color="text-emerald-500"
                bgColor="bg-emerald-50 dark:bg-emerald-500/10"
              />
              <GuideStep
                step={2}
                icon={Users}
                title="Upload Your Employees"
                description="Import your employee list to onboard via SMS"
                color="text-blue-500"
                bgColor="bg-blue-50 dark:bg-blue-500/10"
              />
              <GuideStep
                step={3}
                icon={Zap}
                title="Activate Team Benefits"
                description="Go live — employees start saving immediately"
                color="text-[#E35000]"
                bgColor="bg-orange-50 dark:bg-[#E35000]/10"
              />
            </div>

            <Button
              onClick={onClose}
              className="w-full bg-[#C44500] hover:bg-[#a03800] text-white shadow-lg shadow-orange-200 dark:shadow-none"
            >
              Get Started
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function GuideStep({ step, icon: Icon, title, description, color, bgColor }: any) {
  return (
    <div className="flex gap-4 items-center">
      <div className={`shrink-0 p-2 rounded-full ${bgColor} ${color}`}>
        <Icon size={18} />
      </div>
      <div>
        <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{title}</h4>
        <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
      </div>
    </div>
  );
}
