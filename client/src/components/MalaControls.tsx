import { motion } from "framer-motion";
import { Plus, RotateCcw } from "lucide-react";

interface MalaControlsProps {
  completedMalas: number;
  onIncrement: () => void;
  onReset: () => void;
}

export default function MalaControls({ completedMalas, onIncrement, onReset }: MalaControlsProps) {
  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Increment button */}
      <motion.button 
        onClick={onIncrement}
        whileTap={{ scale: 0.95 }}
        className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
      >
        <Plus className="text-white text-3xl" />
      </motion.button>

      {/* Stats and reset */}
      <div className="flex justify-between items-center w-full">
        <div className="flex flex-col">
          <span className="text-charcoal/70 text-xs md:text-sm">Completed Malas</span>
          <span className="text-xl md:text-2xl font-semibold">{completedMalas}</span>
        </div>
        
        <button 
          onClick={onReset}
          className="px-4 py-2 border border-[#C17E61]/50 text-[#C17E61] rounded-md hover:bg-[#C17E61]/10 transition-colors focus:outline-none focus:ring-2 focus:ring-[#C17E61] focus:ring-opacity-30 text-sm md:text-base flex items-center"
        >
          <RotateCcw className="mr-1 h-4 w-4" /> Reset
        </button>
      </div>
    </div>
  );
}
