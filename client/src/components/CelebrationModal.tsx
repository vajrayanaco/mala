import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BrainCircuit } from "lucide-react";

interface CelebrationModalProps {
  isOpen: boolean;
  onContinue: () => void;
}

export default function CelebrationModal({ isOpen, onContinue }: CelebrationModalProps) {
  // When the modal opens, add a class to prevent scrolling
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 flex items-center justify-center bg-charcoal/70 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div 
            className="bg-background rounded-lg p-6 max-w-xs w-full text-center shadow-xl"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-[#68A7AD] text-5xl mb-3 flex justify-center">
              <BrainCircuit size={48} />
            </div>
            <h2 className="font-['Cormorant_Garamond'] text-2xl font-semibold mb-2">Mala Completed!</h2>
            <p className="mb-4 text-charcoal/70">You've completed a full mala of 108 recitations.</p>
            <div className="flex justify-center space-x-3">
              <button 
                onClick={onContinue}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
              >
                Continue
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
