import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface MalaVisualizationProps {
  currentCount: number;
  totalBeads: number;
}

export default function MalaVisualization({ currentCount, totalBeads }: MalaVisualizationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Clear container
    containerRef.current.innerHTML = '';
    
    // Create beads positioned in a circle
    const radius = 124; // Slightly smaller than parent container
    const centerX = 128; // Center coordinates
    const centerY = 128;
    
    for (let i = 0; i < totalBeads; i++) {
      // Calculate position on the circle
      const angle = (i / totalBeads) * 2 * Math.PI;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      
      // Create bead element
      const bead = document.createElement('div');
      bead.className = 'absolute w-2.5 h-2.5 md:w-3 md:h-3 rounded-full transition-all duration-300';
      bead.style.transform = `translate(${x}px, ${y}px)`;
      bead.style.backgroundColor = i < currentCount ? 'rgb(249, 168, 38)' : 'rgb(209, 213, 219)';
      bead.dataset.index = i.toString();
      
      if (i < currentCount) {
        bead.style.transform = `translate(${x}px, ${y}px) scale(1.2)`;
      }
      
      containerRef.current.appendChild(bead);
    }
  }, [totalBeads]);
  
  // Update beads when currentCount changes
  useEffect(() => {
    if (!containerRef.current) return;
    
    const beads = containerRef.current.querySelectorAll<HTMLDivElement>('div');
    beads.forEach((bead, index) => {
      if (index < currentCount) {
        bead.style.backgroundColor = 'rgb(249, 168, 38)'; // #F9A826
        
        // Extract the existing transform coordinates
        const transform = bead.style.transform;
        const coordinates = transform.split('translate(')[1]?.split(')')[0];
        
        if (coordinates) {
          bead.style.transform = `translate(${coordinates}) scale(1.2)`;
        }
      } else {
        bead.style.backgroundColor = 'rgb(209, 213, 219)'; // #D1D5DB
        
        // Reset scale but keep position
        const transform = bead.style.transform;
        const coordinates = transform.split('translate(')[1]?.split(')')[0];
        
        if (coordinates) {
          bead.style.transform = `translate(${coordinates})`;
        }
      }
    });
  }, [currentCount]);

  return (
    <div className="relative flex justify-center items-center mb-6">
      <div className="w-64 h-64 md:w-72 md:h-72 rounded-full border-4 border-primary/30 flex items-center justify-center relative">
        <div ref={containerRef} className="absolute inset-0 rounded-full"></div>
        
        <motion.div 
          className="text-center z-10"
          key={currentCount}
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <div className="font-['Cormorant_Garamond'] text-5xl md:text-6xl font-semibold">
            {currentCount}
          </div>
          <div className="text-charcoal/60 text-sm mt-1">of 108</div>
        </motion.div>
      </div>
    </div>
  );
}
