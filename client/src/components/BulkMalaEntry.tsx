import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";

interface BulkMalaEntryProps {
  id: string;
  title: string;
  onAddBulkMalas: (count: number) => void;
  completedMalas: number;
  totalRecitations: number;
  onReset: () => void;
  iconSrc?: string;
  customImageUrl?: string;
}

export default function BulkMalaEntry({ 
  id,
  title,
  onAddBulkMalas, 
  completedMalas, 
  totalRecitations,
  onReset,
  iconSrc,
  customImageUrl
}: BulkMalaEntryProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [bulkCount, setBulkCount] = useState<number>(1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Set up sortable attributes for drag-and-drop functionality
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.8 : 1,
  };

  // Mutation for uploading deity image
  const uploadImageMutation = useMutation({
    mutationFn: async (imageData: { deityId: string, imageDataUrl: string }) => {
      const response = await apiRequest("POST", "/api/deityImage", imageData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/mala"] });
    },
  });

  const handleQuickAdd = () => {
    if (bulkCount > 0) {
      onAddBulkMalas(1);
    }
  };

  const handleSubmitBulk = () => {
    if (bulkCount > 0) {
      onAddBulkMalas(bulkCount);
      setIsExpanded(false);
    }
  };

  // Handle image click to prompt file selector
  const handleImageClick = (e: React.MouseEvent) => {
    // Don't trigger during drag operations
    if (isDragging) return;
    
    // Prevent bubbling to parent drag handlers
    e.stopPropagation();
    
    // Trigger file input click
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file is an image
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Read the file and convert to data URL
    const reader = new FileReader();
    reader.onload = (event) => {
      const imageDataUrl = event.target?.result as string;
      
      // Upload the image
      uploadImageMutation.mutate({
        deityId: id,
        imageDataUrl
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className="border border-primary/30 rounded-lg p-4 mb-6 bg-white"
    >
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />
      
      <div 
        {...attributes} 
        {...listeners} 
        className="cursor-grab touch-manipulation active:cursor-grabbing pb-2 text-center"
      >
        <div className="w-8 h-1 bg-gray-300 mx-auto rounded-full mb-2" />
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        
        {/* Deity icon - clickable */}
        <div 
          className="w-24 h-24 mx-auto mb-3 relative group cursor-pointer"
          onClick={handleImageClick}
        >
          {/* Show custom image if available, otherwise show default icon */}
          <img 
            src={customImageUrl || iconSrc} 
            alt={`${title} icon`} 
            className="w-full h-full object-contain" 
          />
          
          {/* Overlay with "Change" text on hover */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center transition-all duration-200 rounded">
            <span className="text-white opacity-0 group-hover:opacity-100 text-sm font-medium">
              Change Image
            </span>
          </div>
          
          {/* Loading spinner during upload */}
          {uploadImageMutation.isPending && (
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>
      </div>
      
      {/* Stats section */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        <div className="bg-white rounded-md p-3 border border-primary/10">
          <div className="text-sm text-charcoal/70">Completed Malas</div>
          <motion.div 
            key={completedMalas || 0}
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="text-2xl font-semibold text-primary"
          >
            {completedMalas || 0}
          </motion.div>
        </div>
        
        <div className="bg-white rounded-md p-3 border border-primary/10">
          <div className="text-sm text-charcoal/70">Total Recitations</div>
          <motion.div 
            key={totalRecitations || 0}
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="text-2xl font-semibold text-primary"
          >
            {(totalRecitations || 0).toLocaleString()}
          </motion.div>
        </div>
      </div>
      
      <div className="flex flex-col items-end">
        <div className="flex items-center gap-2 mb-2">
          {/* Quick add single mala button */}
          <button 
            onClick={handleQuickAdd}
            className="bg-orange-500 text-white px-4 py-2 rounded-md flex items-center justify-center hover:bg-orange-600 transition-colors"
          >
            Add 1
          </button>
          
          {/* Add More button */}
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className={`px-4 py-2 rounded-md flex items-center justify-center ${isExpanded ? "bg-gray-400" : "bg-orange-500"} text-white hover:opacity-90 transition-colors`}
          >
            {isExpanded ? "Cancel" : "Add More"}
          </button>
        </div>
        
        {/* Reset link */}
        <button 
          onClick={onReset}
          className="text-sm text-red-600 hover:text-red-800 underline"
        >
          Reset Counter
        </button>
      </div>
      
      {/* Expanded bulk entry section */}
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ 
          height: isExpanded ? "auto" : 0,
          opacity: isExpanded ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-col md:flex-row gap-3 items-center">
            <div className="w-full">
              <label htmlFor="bulkCount" className="block text-sm font-medium text-gray-700 mb-1">
                Number of Complete Mala Sets
              </label>
              <input
                id="bulkCount"
                type="number"
                min="1"
                value={bulkCount}
                onChange={(e) => setBulkCount(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <button
              onClick={handleSubmitBulk}
              className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors w-full md:w-auto mt-2 md:mt-5"
            >
              Add {bulkCount} Complete {bulkCount === 1 ? "Mala" : "Malas"} ({bulkCount * 108} recitations)
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}