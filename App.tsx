import React, { useState, useEffect } from 'react';
import { StreakCard } from './components/StreakCard';
import { MotivationModal } from './components/MotivationModal';
import { CategoryType, StreakData, STORAGE_KEY } from './types';
import { getTodayDateString, calculateStreakStatus } from './utils';
import { Activity } from 'lucide-react';

const INITIAL_DATA: StreakData[] = [
  {
    id: 'dev',
    type: CategoryType.DEVELOPMENT,
    currentStreak: 0,
    bestStreak: 0,
    lastCompletedDate: null,
    history: []
  },
  {
    id: 'nutri',
    type: CategoryType.NUTRITION,
    currentStreak: 0,
    bestStreak: 0,
    lastCompletedDate: null,
    history: []
  },
  {
    id: 'phys',
    type: CategoryType.PHYSICAL,
    currentStreak: 0,
    bestStreak: 0,
    lastCompletedDate: null,
    history: []
  }
];

export default function App() {
  const [streaks, setStreaks] = useState<StreakData[]>(INITIAL_DATA);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ category: CategoryType.DEVELOPMENT, message: "" });
  const [loadingMotivation, setLoadingMotivation] = useState(false);

  // Load data and process logic on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed: StreakData[] = JSON.parse(stored);
        
        // Process reset logic if days were missed
        const updated = parsed.map(streak => {
          const { isBroken } = calculateStreakStatus(streak.lastCompletedDate);
          if (isBroken) {
            return { ...streak, currentStreak: 0 };
          }
          return streak;
        });
        
        setStreaks(updated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to parse storage", e);
      }
    }
  }, []);

  const handleComplete = (id: string) => {
    const today = getTodayDateString();
    
    const updatedStreaks = streaks.map(streak => {
      if (streak.id === id) {
        if (streak.lastCompletedDate === today) return streak;

        const newCurrent = streak.currentStreak + 1;
        return {
          ...streak,
          currentStreak: newCurrent,
          bestStreak: Math.max(streak.bestStreak, newCurrent),
          lastCompletedDate: today,
          history: [...streak.history, today]
        };
      }
      return streak;
    });

    setStreaks(updatedStreaks);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedStreaks));
  };

  const handleReset = (id: string) => {
    const updatedStreaks = streaks.map(streak => {
      if (streak.id === id) {
        return { ...streak, currentStreak: 0, lastCompletedDate: null };
      }
      return streak;
    });
    setStreaks(updatedStreaks);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedStreaks));
  };

  const openMotivation = (category: CategoryType, message: string) => {
    setModalContent({ category, message });
    setModalOpen(true);
  };

  const totalStreak = streaks.reduce((acc, curr) => acc + curr.currentStreak, 0);

  return (
    <div className="min-h-screen bg-[#030712] text-gray-100 font-sans flex flex-col items-center">
      
      <main className="w-full max-w-lg px-4 py-8 flex flex-col h-full min-h-screen">
        
        {/* Compact Header */}
        <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-tr from-purple-600 to-indigo-600 p-2.5 rounded-xl shadow-lg shadow-purple-900/20">
                <Activity size={22} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight leading-none">
                  TriStreak
                </h1>
                <p className="text-xs text-gray-500 font-medium">Daily Tracker</p>
              </div>
            </div>
            
            <div className="flex flex-col items-end">
                 <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Total</span>
                 <span className="text-2xl font-black text-white leading-none tracking-tight">{totalStreak}</span>
            </div>
        </div>

        {/* Motivational Quote (Static or dynamic intro) */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">
            Foco no progresso.
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Marque seus pilares diários. A consistência é o segredo do resultado.
          </p>
        </div>

        {/* Vertical List Layout */}
        <div className="flex flex-col gap-3 w-full flex-grow">
          {streaks.map(streak => (
            <StreakCard 
              key={streak.id}
              data={streak}
              onComplete={handleComplete}
              onReset={handleReset}
              onShowMotivation={openMotivation}
              setLoadingMotivation={setLoadingMotivation}
            />
          ))}
        </div>

      </main>

      <MotivationModal 
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        category={modalContent.category}
        message={modalContent.message}
        isLoading={loadingMotivation}
      />

    </div>
  );
}