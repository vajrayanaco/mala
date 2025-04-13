import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import BulkMalaEntry from "@/components/BulkMalaEntry";
import CelebrationModal from "@/components/CelebrationModal";
import ResetConfirmationModal from "@/components/ResetConfirmationModal";
import type { Mala } from "@shared/schema";
import * as XLSX from 'xlsx';
import { setupPWAInstallPrompt } from "@/pwa/register-sw";
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";

// Import deity SVG icons
import amitabhaSvg from "../assets/amitabha.svg";
import guruRinpocheSvg from "../assets/guru_rinpoche.svg";
import greenTaraSvg from "../assets/green_tara.svg";
import whiteTaraSvg from "../assets/white_tara.svg";
import chenrezigSvg from "../assets/chenrezig.svg";
import dzambhalaSvg from "../assets/dzambhala.svg";
import shakyamuniSvg from "../assets/shakyamuni.svg";
import medicineBuddhaSvg from "../assets/medicine_buddha.svg";
import manjushriSvg from "../assets/manjushri.svg";
import vajrasattvaSvg from "../assets/vajrasattva.svg";
import confessionsSvg from "../assets/confessions.svg";

export default function Home() {
  // Reset confirmation modals state
  const [isResetAmitabhaModalOpen, setIsResetAmitabhaModalOpen] = useState(false);
  const [isResetGuruRinpocheModalOpen, setIsResetGuruRinpocheModalOpen] = useState(false);
  const [isResetGreenTaraModalOpen, setIsResetGreenTaraModalOpen] = useState(false);
  const [isResetWhiteTaraModalOpen, setIsResetWhiteTaraModalOpen] = useState(false);
  const [isResetChenrezigModalOpen, setIsResetChenrezigModalOpen] = useState(false);
  const [isResetDzambhalaModalOpen, setIsResetDzambhalaModalOpen] = useState(false);
  const [isResetShakyamuniModalOpen, setIsResetShakyamuniModalOpen] = useState(false);
  const [isResetMedicineBuddhaModalOpen, setIsResetMedicineBuddhaModalOpen] = useState(false);
  const [isResetManjushriModalOpen, setIsResetManjushriModalOpen] = useState(false);
  const [isResetVajrasattvaModalOpen, setIsResetVajrasattvaModalOpen] = useState(false);
  const [isResetConfessionsModalOpen, setIsResetConfessionsModalOpen] = useState(false);
  const [isCelebrationModalOpen, setIsCelebrationModalOpen] = useState(false);
  
  // Initial local state
  const [localState, setLocalState] = useState<Mala>({
    id: 0,
    userId: null,
    currentCount: 0,
    completedMalas: 0,
    totalRecitations: 0,
    guruRinpocheCompletedMalas: 0,
    guruRinpocheTotalRecitations: 0,
    greenTaraCompletedMalas: 0,
    greenTaraTotalRecitations: 0,
    whiteTaraCompletedMalas: 0,
    whiteTaraTotalRecitations: 0,
    chenrezigCompletedMalas: 0,
    chenrezigTotalRecitations: 0,
    dzambhalaCompletedMalas: 0,
    dzambhalaTotalRecitations: 0,
    shakyamuniCompletedMalas: 0,
    shakyamuniTotalRecitations: 0,
    medicineBuddhaCompletedMalas: 0,
    medicineBuddhaTotalRecitations: 0,
    manjushriCompletedMalas: 0,
    manjushriTotalRecitations: 0,
    vajrasattvaCompletedMalas: 0,
    vajrasattvaTotalRecitations: 0,
    confessionsCompletedMalas: 0,
    confessionsTotalRecitations: 0,
    // Initialize custom image URLs as empty strings
    amitabhaImageUrl: '',
    guruRinpocheImageUrl: '',
    greenTaraImageUrl: '',
    whiteTaraImageUrl: '',
    chenrezigImageUrl: '',
    dzambhalaImageUrl: '',
    shakyamuniImageUrl: '',
    medicineBuddhaImageUrl: '',
    manjushriImageUrl: '',
    vajrasattvaImageUrl: '',
    confessionsImageUrl: ''
  });

  // Define the sortable mantra items
  const [items, setItems] = useState([
    { id: 'amitabha', title: 'Amitabha Mantra', icon: amitabhaSvg },
    { id: 'guru-rinpoche', title: 'Guru Rinpoche Mantra', icon: guruRinpocheSvg },
    { id: 'green-tara', title: 'Green Tara Mantra', icon: greenTaraSvg },
    { id: 'white-tara', title: 'White Tara Mantra', icon: whiteTaraSvg },
    { id: 'chenrezig', title: 'Chenrezig Mantra', icon: chenrezigSvg },
    { id: 'dzambhala', title: 'Dzambhala Mantra', icon: dzambhalaSvg },
    { id: 'shakyamuni', title: 'Shakyamuni Mantra', icon: shakyamuniSvg },
    { id: 'medicine-buddha', title: 'Medicine Buddha Mantra', icon: medicineBuddhaSvg },
    { id: 'manjushri', title: 'Manjushri Mantra', icon: manjushriSvg },
    { id: 'vajrasattva', title: 'Vajrasattva Mantra', icon: vajrasattvaSvg },
    { id: 'confessions', title: '35 Confessions Mantra', icon: confessionsSvg }
  ]);

  // Fetch mala state from server
  const { data: malaState, isLoading } = useQuery<Mala>({
    queryKey: ["/api/mala"],
  });

  // Update local state when server data is loaded
  useEffect(() => {
    if (malaState) {
      setLocalState(malaState);
    }
  }, [malaState]);

  // Save mala state to server
  const updateMalaMutation = useMutation({
    mutationFn: async (data: Partial<Mala>) => {
      const response = await apiRequest("POST", "/api/mala", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/mala"] });
    },
  });

  // Setup sensors for drag-and-drop functionality
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { delay: 100, tolerance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );
  
  // Set up the PWA install functionality
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const promptInstall = setupPWAInstallPrompt();
  
  // Show the install button when PWA can be installed
  useEffect(() => {
    const handleBeforeInstallPrompt = () => {
      setShowInstallPrompt(true);
      
      // Show the install container that's hidden by default
      const container = document.querySelector('.pwa-install-container');
      if (container) {
        container.classList.remove('hidden');
      }
    };
    
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);
  
  // PWA install button handler
  const handleInstallClick = () => {
    if (promptInstall) {
      promptInstall();
    } else {
      // Fallback instructions for iOS devices which don't support beforeinstallprompt
      alert('To install this app on your device:\n\n1. Tap the Share button in your browser\n2. Scroll down and select "Add to Home Screen"');
    }
  };

  // Handle drag-and-drop reordering
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setItems((currentItems) => {
        const oldIndex = currentItems.findIndex(item => item.id === active.id);
        const newIndex = currentItems.findIndex(item => item.id === over.id);
        
        return arrayMove(currentItems, oldIndex, newIndex);
      });
    }
  };

  const handleContinue = () => {
    // Increment completed malas and reset current count
    const newCompletedMalas = localState.completedMalas + 1;
    const newTotalRecitations = localState.totalRecitations + 108;
    
    setLocalState((prev) => ({
      ...prev,
      currentCount: 0,
      completedMalas: newCompletedMalas,
      totalRecitations: newTotalRecitations
    }));

    // Close celebration modal
    setIsCelebrationModalOpen(false);

    // Update server state
    updateMalaMutation.mutate({
      currentCount: 0,
      completedMalas: newCompletedMalas,
      totalRecitations: newTotalRecitations
    });
  };

  const handleAddAmitabhaBulkMalas = (count: number) => {
    if (count <= 0) return;
    
    // Calculate new values
    const recitationsToAdd = count * 108;
    const newCompletedMalas = localState.completedMalas + count;
    const newTotalRecitations = localState.totalRecitations + recitationsToAdd;
    
    // Update local state
    setLocalState((prev) => ({
      ...prev,
      completedMalas: newCompletedMalas,
      totalRecitations: newTotalRecitations
    }));
    
    // Update server state
    updateMalaMutation.mutate({
      completedMalas: newCompletedMalas,
      totalRecitations: newTotalRecitations
    });
  };

  const handleAddGuruRinpocheBulkMalas = (count: number) => {
    if (count <= 0) return;
    
    // Calculate new values
    const recitationsToAdd = count * 108;
    const newCompletedMalas = localState.guruRinpocheCompletedMalas + count;
    const newTotalRecitations = localState.guruRinpocheTotalRecitations + recitationsToAdd;
    
    // Update local state
    setLocalState((prev) => ({
      ...prev,
      guruRinpocheCompletedMalas: newCompletedMalas,
      guruRinpocheTotalRecitations: newTotalRecitations
    }));
    
    // Update server state
    updateMalaMutation.mutate({
      guruRinpocheCompletedMalas: newCompletedMalas,
      guruRinpocheTotalRecitations: newTotalRecitations
    });
  };

  const handleAddGreenTaraBulkMalas = (count: number) => {
    if (count <= 0) return;
    
    // Calculate new values
    const recitationsToAdd = count * 108;
    const newCompletedMalas = localState.greenTaraCompletedMalas + count;
    const newTotalRecitations = localState.greenTaraTotalRecitations + recitationsToAdd;
    
    // Update local state
    setLocalState((prev) => ({
      ...prev,
      greenTaraCompletedMalas: newCompletedMalas,
      greenTaraTotalRecitations: newTotalRecitations
    }));
    
    // Update server state
    updateMalaMutation.mutate({
      greenTaraCompletedMalas: newCompletedMalas,
      greenTaraTotalRecitations: newTotalRecitations
    });
  };

  const handleAddWhiteTaraBulkMalas = (count: number) => {
    if (count <= 0) return;
    
    // Calculate new values
    const recitationsToAdd = count * 108;
    const newCompletedMalas = localState.whiteTaraCompletedMalas + count;
    const newTotalRecitations = localState.whiteTaraTotalRecitations + recitationsToAdd;
    
    // Update local state
    setLocalState((prev) => ({
      ...prev,
      whiteTaraCompletedMalas: newCompletedMalas,
      whiteTaraTotalRecitations: newTotalRecitations
    }));
    
    // Update server state
    updateMalaMutation.mutate({
      whiteTaraCompletedMalas: newCompletedMalas,
      whiteTaraTotalRecitations: newTotalRecitations
    });
  };

  const handleAddChenrezigBulkMalas = (count: number) => {
    if (count <= 0) return;
    
    // Calculate new values
    const recitationsToAdd = count * 108;
    const newCompletedMalas = localState.chenrezigCompletedMalas + count;
    const newTotalRecitations = localState.chenrezigTotalRecitations + recitationsToAdd;
    
    // Update local state
    setLocalState((prev) => ({
      ...prev,
      chenrezigCompletedMalas: newCompletedMalas,
      chenrezigTotalRecitations: newTotalRecitations
    }));
    
    // Update server state
    updateMalaMutation.mutate({
      chenrezigCompletedMalas: newCompletedMalas,
      chenrezigTotalRecitations: newTotalRecitations
    });
  };

  const handleAddDzambhalaBulkMalas = (count: number) => {
    if (count <= 0) return;
    
    // Calculate new values
    const recitationsToAdd = count * 108;
    const newCompletedMalas = localState.dzambhalaCompletedMalas + count;
    const newTotalRecitations = localState.dzambhalaTotalRecitations + recitationsToAdd;
    
    // Update local state
    setLocalState((prev) => ({
      ...prev,
      dzambhalaCompletedMalas: newCompletedMalas,
      dzambhalaTotalRecitations: newTotalRecitations
    }));
    
    // Update server state
    updateMalaMutation.mutate({
      dzambhalaCompletedMalas: newCompletedMalas,
      dzambhalaTotalRecitations: newTotalRecitations
    });
  };

  const handleAddShakyamuniBulkMalas = (count: number) => {
    if (count <= 0) return;
    
    // Calculate new values
    const recitationsToAdd = count * 108;
    const newCompletedMalas = localState.shakyamuniCompletedMalas + count;
    const newTotalRecitations = localState.shakyamuniTotalRecitations + recitationsToAdd;
    
    // Update local state
    setLocalState((prev) => ({
      ...prev,
      shakyamuniCompletedMalas: newCompletedMalas,
      shakyamuniTotalRecitations: newTotalRecitations
    }));
    
    // Update server state
    updateMalaMutation.mutate({
      shakyamuniCompletedMalas: newCompletedMalas,
      shakyamuniTotalRecitations: newTotalRecitations
    });
  };

  const handleAddMedicineBuddhaBulkMalas = (count: number) => {
    if (count <= 0) return;
    
    // Calculate new values
    const recitationsToAdd = count * 108;
    const newCompletedMalas = localState.medicineBuddhaCompletedMalas + count;
    const newTotalRecitations = localState.medicineBuddhaTotalRecitations + recitationsToAdd;
    
    // Update local state
    setLocalState((prev) => ({
      ...prev,
      medicineBuddhaCompletedMalas: newCompletedMalas,
      medicineBuddhaTotalRecitations: newTotalRecitations
    }));
    
    // Update server state
    updateMalaMutation.mutate({
      medicineBuddhaCompletedMalas: newCompletedMalas,
      medicineBuddhaTotalRecitations: newTotalRecitations
    });
  };

  const handleAddManjushriBulkMalas = (count: number) => {
    if (count <= 0) return;
    
    // Calculate new values
    const recitationsToAdd = count * 108;
    const newCompletedMalas = localState.manjushriCompletedMalas + count;
    const newTotalRecitations = localState.manjushriTotalRecitations + recitationsToAdd;
    
    // Update local state
    setLocalState((prev) => ({
      ...prev,
      manjushriCompletedMalas: newCompletedMalas,
      manjushriTotalRecitations: newTotalRecitations
    }));
    
    // Update server state
    updateMalaMutation.mutate({
      manjushriCompletedMalas: newCompletedMalas,
      manjushriTotalRecitations: newTotalRecitations
    });
  };

  const handleAddVajrasattvaBulkMalas = (count: number) => {
    if (count <= 0) return;
    
    // Calculate new values
    const recitationsToAdd = count * 108;
    const newCompletedMalas = localState.vajrasattvaCompletedMalas + count;
    const newTotalRecitations = localState.vajrasattvaTotalRecitations + recitationsToAdd;
    
    // Update local state
    setLocalState((prev) => ({
      ...prev,
      vajrasattvaCompletedMalas: newCompletedMalas,
      vajrasattvaTotalRecitations: newTotalRecitations
    }));
    
    // Update server state
    updateMalaMutation.mutate({
      vajrasattvaCompletedMalas: newCompletedMalas,
      vajrasattvaTotalRecitations: newTotalRecitations
    });
  };

  const handleAddConfessionsBulkMalas = (count: number) => {
    if (count <= 0) return;
    
    // Calculate new values
    const recitationsToAdd = count * 108;
    const newCompletedMalas = localState.confessionsCompletedMalas + count;
    const newTotalRecitations = localState.confessionsTotalRecitations + recitationsToAdd;
    
    // Update local state
    setLocalState((prev) => ({
      ...prev,
      confessionsCompletedMalas: newCompletedMalas,
      confessionsTotalRecitations: newTotalRecitations
    }));
    
    // Update server state
    updateMalaMutation.mutate({
      confessionsCompletedMalas: newCompletedMalas,
      confessionsTotalRecitations: newTotalRecitations
    });
  };

  // Reset handlers for each mantra type
  const handleResetAmitabha = () => {
    setIsResetAmitabhaModalOpen(true);
  };

  const handleConfirmResetAmitabha = () => {
    setLocalState((prev) => ({
      ...prev,
      completedMalas: 0,
      totalRecitations: 0
    }));
    setIsResetAmitabhaModalOpen(false);
    updateMalaMutation.mutate({
      completedMalas: 0,
      totalRecitations: 0
    });
  };

  const handleResetGuruRinpoche = () => {
    setIsResetGuruRinpocheModalOpen(true);
  };

  const handleConfirmResetGuruRinpoche = () => {
    setLocalState((prev) => ({
      ...prev,
      guruRinpocheCompletedMalas: 0,
      guruRinpocheTotalRecitations: 0
    }));
    setIsResetGuruRinpocheModalOpen(false);
    updateMalaMutation.mutate({
      guruRinpocheCompletedMalas: 0,
      guruRinpocheTotalRecitations: 0
    });
  };

  const handleResetGreenTara = () => {
    setIsResetGreenTaraModalOpen(true);
  };

  const handleConfirmResetGreenTara = () => {
    setLocalState((prev) => ({
      ...prev,
      greenTaraCompletedMalas: 0,
      greenTaraTotalRecitations: 0
    }));
    setIsResetGreenTaraModalOpen(false);
    updateMalaMutation.mutate({
      greenTaraCompletedMalas: 0,
      greenTaraTotalRecitations: 0
    });
  };

  const handleResetWhiteTara = () => {
    setIsResetWhiteTaraModalOpen(true);
  };

  const handleConfirmResetWhiteTara = () => {
    setLocalState((prev) => ({
      ...prev,
      whiteTaraCompletedMalas: 0,
      whiteTaraTotalRecitations: 0
    }));
    setIsResetWhiteTaraModalOpen(false);
    updateMalaMutation.mutate({
      whiteTaraCompletedMalas: 0,
      whiteTaraTotalRecitations: 0
    });
  };

  const handleResetChenrezig = () => {
    setIsResetChenrezigModalOpen(true);
  };

  const handleConfirmResetChenrezig = () => {
    setLocalState((prev) => ({
      ...prev,
      chenrezigCompletedMalas: 0,
      chenrezigTotalRecitations: 0
    }));
    setIsResetChenrezigModalOpen(false);
    updateMalaMutation.mutate({
      chenrezigCompletedMalas: 0,
      chenrezigTotalRecitations: 0
    });
  };

  const handleResetDzambhala = () => {
    setIsResetDzambhalaModalOpen(true);
  };

  const handleConfirmResetDzambhala = () => {
    setLocalState((prev) => ({
      ...prev,
      dzambhalaCompletedMalas: 0,
      dzambhalaTotalRecitations: 0
    }));
    setIsResetDzambhalaModalOpen(false);
    updateMalaMutation.mutate({
      dzambhalaCompletedMalas: 0,
      dzambhalaTotalRecitations: 0
    });
  };

  const handleResetShakyamuni = () => {
    setIsResetShakyamuniModalOpen(true);
  };

  const handleConfirmResetShakyamuni = () => {
    setLocalState((prev) => ({
      ...prev,
      shakyamuniCompletedMalas: 0,
      shakyamuniTotalRecitations: 0
    }));
    setIsResetShakyamuniModalOpen(false);
    updateMalaMutation.mutate({
      shakyamuniCompletedMalas: 0,
      shakyamuniTotalRecitations: 0
    });
  };

  const handleResetMedicineBuddha = () => {
    setIsResetMedicineBuddhaModalOpen(true);
  };

  const handleConfirmResetMedicineBuddha = () => {
    setLocalState((prev) => ({
      ...prev,
      medicineBuddhaCompletedMalas: 0,
      medicineBuddhaTotalRecitations: 0
    }));
    setIsResetMedicineBuddhaModalOpen(false);
    updateMalaMutation.mutate({
      medicineBuddhaCompletedMalas: 0,
      medicineBuddhaTotalRecitations: 0
    });
  };

  const handleResetManjushri = () => {
    setIsResetManjushriModalOpen(true);
  };

  const handleConfirmResetManjushri = () => {
    setLocalState((prev) => ({
      ...prev,
      manjushriCompletedMalas: 0,
      manjushriTotalRecitations: 0
    }));
    setIsResetManjushriModalOpen(false);
    updateMalaMutation.mutate({
      manjushriCompletedMalas: 0,
      manjushriTotalRecitations: 0
    });
  };

  const handleResetVajrasattva = () => {
    setIsResetVajrasattvaModalOpen(true);
  };

  const handleConfirmResetVajrasattva = () => {
    setLocalState((prev) => ({
      ...prev,
      vajrasattvaCompletedMalas: 0,
      vajrasattvaTotalRecitations: 0
    }));
    setIsResetVajrasattvaModalOpen(false);
    updateMalaMutation.mutate({
      vajrasattvaCompletedMalas: 0,
      vajrasattvaTotalRecitations: 0
    });
  };

  const handleResetConfessions = () => {
    setIsResetConfessionsModalOpen(true);
  };

  const handleConfirmResetConfessions = () => {
    setLocalState((prev) => ({
      ...prev,
      confessionsCompletedMalas: 0,
      confessionsTotalRecitations: 0
    }));
    setIsResetConfessionsModalOpen(false);
    updateMalaMutation.mutate({
      confessionsCompletedMalas: 0,
      confessionsTotalRecitations: 0
    });
  };
  
  // Export data as JSON
  const handleExportJSON = () => {
    // Create a downloadable JSON file with all mala data
    const dataToExport = { ...localState, exportDate: new Date().toISOString() };
    const dataStr = JSON.stringify(dataToExport, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    // Create and trigger download
    const exportFileName = `mala-counter-data-${new Date().toISOString().slice(0, 10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileName);
    linkElement.click();
  };
  
  // Export data as Excel
  const handleExportExcel = () => {
    // Prepare data for Excel format
    const worksheetData = [
      ['Deity', 'Completed Malas', 'Total Recitations'],
      ['Amitabha', localState.completedMalas, localState.totalRecitations],
      ['Guru Rinpoche', localState.guruRinpocheCompletedMalas, localState.guruRinpocheTotalRecitations],
      ['Green Tara', localState.greenTaraCompletedMalas, localState.greenTaraTotalRecitations],
      ['White Tara', localState.whiteTaraCompletedMalas, localState.whiteTaraTotalRecitations],
      ['Chenrezig', localState.chenrezigCompletedMalas, localState.chenrezigTotalRecitations],
      ['Dzambhala', localState.dzambhalaCompletedMalas, localState.dzambhalaTotalRecitations],
      ['Shakyamuni', localState.shakyamuniCompletedMalas, localState.shakyamuniTotalRecitations],
      ['Medicine Buddha', localState.medicineBuddhaCompletedMalas, localState.medicineBuddhaTotalRecitations],
      ['Manjushri', localState.manjushriCompletedMalas, localState.manjushriTotalRecitations],
      ['Vajrasattva', localState.vajrasattvaCompletedMalas, localState.vajrasattvaTotalRecitations],
      ['35 Confessions', localState.confessionsCompletedMalas, localState.confessionsTotalRecitations]
    ];
    
    // Create Excel workbook and sheet
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Mala Counter Data');
    
    // Generate Excel file and trigger download
    const exportFileName = `mala-counter-data-${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(workbook, exportFileName);
  };
  
  // Import backup data
  const handleImportFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Read the JSON file
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string;
        const importedData = JSON.parse(content);
        
        // Call the API to update the state with the imported data
        const response = await apiRequest("POST", "/api/importData", importedData);
        const result = await response.json();
        
        if (result.success) {
          // Update the local state with the imported data
          queryClient.invalidateQueries({ queryKey: ["/api/mala"] });
          alert("Data imported successfully!");
        } else {
          alert("Failed to import data: " + (result.message || "Unknown error"));
        }
      } catch (error) {
        console.error("Error importing data:", error);
        alert("Failed to import data. Please make sure the file is a valid JSON backup.");
      }
      
      // Reset the file input
      event.target.value = '';
    };
    
    reader.readAsText(file);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background font-sans">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-background font-sans text-charcoal min-h-screen flex flex-col items-center p-4">
      <div className="w-full max-w-md mx-auto">
        <header className="text-center mb-8 mt-4">
          <h1 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl font-semibold mb-2">Mala Counter</h1>
          <p className="text-sm text-gray-600 mb-1">Long press or drag to reorder mantras</p>
          <p className="text-sm text-gray-600 mb-2">Click the image to replace with an image of your choice</p>
        </header>

        <main className="relative">
          <DndContext 
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext 
              items={items.map(item => item.id)}
              strategy={verticalListSortingStrategy}
            >
              {items.map(item => {
                // Determine which mantra data to use based on item ID
                let completedMalas = 0;
                let totalRecitations = 0;
                let handleAddBulkMalas = handleAddAmitabhaBulkMalas; // Default
                let handleReset = handleResetAmitabha; // Default

                switch(item.id) {
                  case 'amitabha':
                    completedMalas = localState.completedMalas;
                    totalRecitations = localState.totalRecitations;
                    handleAddBulkMalas = handleAddAmitabhaBulkMalas;
                    handleReset = handleResetAmitabha;
                    break;
                  case 'guru-rinpoche':
                    completedMalas = localState.guruRinpocheCompletedMalas;
                    totalRecitations = localState.guruRinpocheTotalRecitations;
                    handleAddBulkMalas = handleAddGuruRinpocheBulkMalas;
                    handleReset = handleResetGuruRinpoche;
                    break;
                  case 'green-tara':
                    completedMalas = localState.greenTaraCompletedMalas;
                    totalRecitations = localState.greenTaraTotalRecitations;
                    handleAddBulkMalas = handleAddGreenTaraBulkMalas;
                    handleReset = handleResetGreenTara;
                    break;
                  case 'white-tara':
                    completedMalas = localState.whiteTaraCompletedMalas;
                    totalRecitations = localState.whiteTaraTotalRecitations;
                    handleAddBulkMalas = handleAddWhiteTaraBulkMalas;
                    handleReset = handleResetWhiteTara;
                    break;
                  case 'chenrezig':
                    completedMalas = localState.chenrezigCompletedMalas;
                    totalRecitations = localState.chenrezigTotalRecitations;
                    handleAddBulkMalas = handleAddChenrezigBulkMalas;
                    handleReset = handleResetChenrezig;
                    break;
                  case 'dzambhala':
                    completedMalas = localState.dzambhalaCompletedMalas;
                    totalRecitations = localState.dzambhalaTotalRecitations;
                    handleAddBulkMalas = handleAddDzambhalaBulkMalas;
                    handleReset = handleResetDzambhala;
                    break;
                  case 'shakyamuni':
                    completedMalas = localState.shakyamuniCompletedMalas;
                    totalRecitations = localState.shakyamuniTotalRecitations;
                    handleAddBulkMalas = handleAddShakyamuniBulkMalas;
                    handleReset = handleResetShakyamuni;
                    break;
                  case 'medicine-buddha':
                    completedMalas = localState.medicineBuddhaCompletedMalas;
                    totalRecitations = localState.medicineBuddhaTotalRecitations;
                    handleAddBulkMalas = handleAddMedicineBuddhaBulkMalas;
                    handleReset = handleResetMedicineBuddha;
                    break;
                  case 'manjushri':
                    completedMalas = localState.manjushriCompletedMalas;
                    totalRecitations = localState.manjushriTotalRecitations;
                    handleAddBulkMalas = handleAddManjushriBulkMalas;
                    handleReset = handleResetManjushri;
                    break;
                  case 'vajrasattva':
                    completedMalas = localState.vajrasattvaCompletedMalas;
                    totalRecitations = localState.vajrasattvaTotalRecitations;
                    handleAddBulkMalas = handleAddVajrasattvaBulkMalas;
                    handleReset = handleResetVajrasattva;
                    break;
                  case 'confessions':
                    completedMalas = localState.confessionsCompletedMalas;
                    totalRecitations = localState.confessionsTotalRecitations;
                    handleAddBulkMalas = handleAddConfessionsBulkMalas;
                    handleReset = handleResetConfessions;
                    break;
                }

                // Determine which custom image URL to use based on deity ID
                let customImageUrl: string | undefined;
                switch(item.id) {
                  case 'amitabha':
                    customImageUrl = localState.amitabhaImageUrl || undefined;
                    break;
                  case 'guru-rinpoche':
                    customImageUrl = localState.guruRinpocheImageUrl || undefined;
                    break;
                  case 'green-tara':
                    customImageUrl = localState.greenTaraImageUrl || undefined;
                    break;
                  case 'white-tara':
                    customImageUrl = localState.whiteTaraImageUrl || undefined;
                    break;
                  case 'chenrezig':
                    customImageUrl = localState.chenrezigImageUrl || undefined;
                    break;
                  case 'dzambhala':
                    customImageUrl = localState.dzambhalaImageUrl || undefined;
                    break;
                  case 'shakyamuni':
                    customImageUrl = localState.shakyamuniImageUrl || undefined;
                    break;
                  case 'medicine-buddha':
                    customImageUrl = localState.medicineBuddhaImageUrl || undefined;
                    break;
                  case 'manjushri':
                    customImageUrl = localState.manjushriImageUrl || undefined;
                    break;
                  case 'vajrasattva':
                    customImageUrl = localState.vajrasattvaImageUrl || undefined;
                    break;
                  case 'confessions':
                    customImageUrl = localState.confessionsImageUrl || undefined;
                    break;
                }

                return (
                  <BulkMalaEntry
                    key={item.id} 
                    id={item.id}
                    title={item.title}
                    iconSrc={item.icon}
                    customImageUrl={customImageUrl}
                    onAddBulkMalas={handleAddBulkMalas}
                    completedMalas={completedMalas}
                    totalRecitations={totalRecitations}
                    onReset={handleReset}
                  />
                );
              })}
            </SortableContext>
          </DndContext>
          
          <CelebrationModal 
            isOpen={isCelebrationModalOpen}
            onContinue={handleContinue}
          />

          <ResetConfirmationModal 
            isOpen={isResetAmitabhaModalOpen}
            onCancel={() => setIsResetAmitabhaModalOpen(false)}
            onConfirm={handleConfirmResetAmitabha}
          />

          <ResetConfirmationModal 
            isOpen={isResetGuruRinpocheModalOpen}
            onCancel={() => setIsResetGuruRinpocheModalOpen(false)}
            onConfirm={handleConfirmResetGuruRinpoche}
          />

          <ResetConfirmationModal 
            isOpen={isResetGreenTaraModalOpen}
            onCancel={() => setIsResetGreenTaraModalOpen(false)}
            onConfirm={handleConfirmResetGreenTara}
          />

          <ResetConfirmationModal 
            isOpen={isResetWhiteTaraModalOpen}
            onCancel={() => setIsResetWhiteTaraModalOpen(false)}
            onConfirm={handleConfirmResetWhiteTara}
          />

          <ResetConfirmationModal 
            isOpen={isResetChenrezigModalOpen}
            onCancel={() => setIsResetChenrezigModalOpen(false)}
            onConfirm={handleConfirmResetChenrezig}
          />

          <ResetConfirmationModal 
            isOpen={isResetDzambhalaModalOpen}
            onCancel={() => setIsResetDzambhalaModalOpen(false)}
            onConfirm={handleConfirmResetDzambhala}
          />

          <ResetConfirmationModal 
            isOpen={isResetShakyamuniModalOpen}
            onCancel={() => setIsResetShakyamuniModalOpen(false)}
            onConfirm={handleConfirmResetShakyamuni}
          />

          <ResetConfirmationModal 
            isOpen={isResetMedicineBuddhaModalOpen}
            onCancel={() => setIsResetMedicineBuddhaModalOpen(false)}
            onConfirm={handleConfirmResetMedicineBuddha}
          />

          <ResetConfirmationModal 
            isOpen={isResetManjushriModalOpen}
            onCancel={() => setIsResetManjushriModalOpen(false)}
            onConfirm={handleConfirmResetManjushri}
          />

          <ResetConfirmationModal 
            isOpen={isResetVajrasattvaModalOpen}
            onCancel={() => setIsResetVajrasattvaModalOpen(false)}
            onConfirm={handleConfirmResetVajrasattva}
          />

          <ResetConfirmationModal 
            isOpen={isResetConfessionsModalOpen}
            onCancel={() => setIsResetConfessionsModalOpen(false)}
            onConfirm={handleConfirmResetConfessions}
          />
        </main>
        
        {/* Data export options */}
        <div className="text-center mt-10 mb-6 p-4 border border-gray-200 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium mb-3">Backup Your Data</h3>
          <p className="text-sm text-gray-600 mb-4">Save your progress and custom images to restore them if you uninstall the app</p>
          
          {/* Export buttons */}
          <div className="flex justify-center gap-4 mb-4">
            <button 
              onClick={() => handleExportJSON()} 
              className="bg-primary text-white px-4 py-2 rounded-md flex items-center justify-center hover:bg-primary/90 transition-colors"
            >
              Download JSON
            </button>
            <button 
              onClick={() => handleExportExcel()} 
              className="bg-green-600 text-white px-4 py-2 rounded-md flex items-center justify-center hover:bg-green-700 transition-colors"
            >
              Download Excel
            </button>
          </div>
          
          {/* Import section */}
          <div className="border-t border-gray-200 pt-4 mt-4">
            <h4 className="text-md font-medium mb-2">Restore Data</h4>
            <p className="text-sm text-gray-600 mb-3">Upload your previously saved JSON backup file</p>
            <input 
              type="file" 
              id="import-file" 
              className="hidden" 
              accept=".json"
              onChange={handleImportFile}
            />
            <button 
              onClick={() => document.getElementById('import-file')?.click()} 
              className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center justify-center mx-auto hover:bg-blue-700 transition-colors"
            >
              Import Backup Data
            </button>
          </div>
          
          {/* PWA Install Button - Only shown when installable */}
          <div className="border-t border-gray-200 pt-4 mt-4 pwa-install-container hidden">
            <h4 className="text-md font-medium mb-2">Get the App</h4>
            <p className="text-sm text-gray-600 mb-3">Install this app on your phone for easy access</p>
            <button 
              id="pwa-install-button"
              className="bg-purple-600 text-white px-4 py-2 rounded-md flex items-center justify-center mx-auto hover:bg-purple-700 transition-colors"
              onClick={handleInstallClick}
            >
              Install App
            </button>
          </div>
        </div>
        
        {/* Footer with credits */}
        <footer className="text-center mt-6 mb-4 text-gray-600 pt-4 border-t border-gray-200">
          <p className="text-sm mb-1">Created by Vajrayana.co</p>
          <p className="text-sm">You can also visit r/TibetanVajrayana on Reddit</p>
        </footer>
      </div>
    </div>
  );
}