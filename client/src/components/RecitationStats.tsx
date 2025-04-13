import { motion } from "framer-motion";

interface RecitationStatsProps {
  completedMalas: number;
  totalRecitations: number;
}

export default function RecitationStats({ 
  completedMalas, 
  totalRecitations 
}: RecitationStatsProps) {
  return (
    <div className="w-full bg-gray-50 rounded-lg p-4 shadow-sm">
      <h3 className="text-lg font-semibold text-center mb-3">Your Recitation Journey</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-md p-3 border border-primary/10">
          <div className="text-sm text-charcoal/70">Completed Malas</div>
          <motion.div 
            key={completedMalas}
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="text-2xl font-semibold text-primary"
          >
            {completedMalas}
          </motion.div>
        </div>
        
        <div className="bg-white rounded-md p-3 border border-primary/10">
          <div className="text-sm text-charcoal/70">Total Recitations</div>
          <motion.div 
            key={totalRecitations}
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="text-2xl font-semibold text-primary"
          >
            {(totalRecitations || 0).toLocaleString()}
          </motion.div>
        </div>
      </div>
    </div>
  );
}