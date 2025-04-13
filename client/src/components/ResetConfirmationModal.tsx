import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";

interface ResetConfirmationModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ResetConfirmationModal({ 
  isOpen, 
  onCancel, 
  onConfirm 
}: ResetConfirmationModalProps) {
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
            <div className="text-[#C17E61] text-4xl mb-3 flex justify-center">
              <AlertTriangle size={36} />
            </div>
            <h2 className="font-['Cormorant_Garamond'] text-xl font-semibold mb-2">Reset Counter?</h2>
            <p className="mb-4 text-charcoal/70">This will reset your current mala progress.</p>
            <div className="flex justify-center space-x-3">
              <button 
                onClick={onCancel}
                className="px-4 py-2 border border-charcoal/30 text-charcoal/70 rounded-md hover:bg-charcoal/10 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={onConfirm}
                className="px-4 py-2 bg-[#C17E61] text-white rounded-md hover:bg-[#C17E61]/90 transition-colors"
              >
                Reset
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
