import React, { useState, useEffect } from 'react';
import { StreakCard } from './components/StreakCard';
import { MotivationModal } from './components/MotivationModal';
import { StoreModal } from './components/StoreModal';
import { CategoryType, StreakData, Wallet, GlobalStats, STORAGE_KEY, WALLET_KEY, GLOBAL_KEY } from './types';
import { getTodayDateString, calculateStreakStatus, addDays } from './utils';
import { Activity, Coins, ShieldCheck, Trophy, ExternalLink } from 'lucide-react';

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
  },
  {
    id: 'hyg',
    type: CategoryType.HYGIENE,
    currentStreak: 0,
    bestStreak: 0,
    lastCompletedDate: null,
    history: []
  }
];

const INITIAL_WALLET: Wallet = {
  coins: 0,
  lastCoinDate: null,
  freezeExpiresAt: null
};

const INITIAL_GLOBAL: GlobalStats = {
  masterStreak: 0,
  lastPerfectDate: null
};

export default function App() {
  const [streaks, setStreaks] = useState<StreakData[]>(INITIAL_DATA);
  const [wallet, setWallet] = useState<Wallet>(INITIAL_WALLET);
  const [globalStats, setGlobalStats] = useState<GlobalStats>(INITIAL_GLOBAL);
  
  // Modals
  const [motivationModalOpen, setMotivationModalOpen] = useState(false);
  const [storeModalOpen, setStoreModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ category: CategoryType.DEVELOPMENT, message: "" });
  const [loadingMotivation, setLoadingMotivation] = useState(false);

  // Load data and process logic on mount
  useEffect(() => {
    // 1. Load Wallet
    const storedWallet = localStorage.getItem(WALLET_KEY);
    let currentWallet = INITIAL_WALLET;
    if (storedWallet) {
      try {
        currentWallet = JSON.parse(storedWallet);
        setWallet(currentWallet);
      } catch (e) { console.error(e); }
    }

    // 2. Check Freeze Status
    const today = getTodayDateString();
    const isFreezeActive = currentWallet.freezeExpiresAt 
      ? new Date(currentWallet.freezeExpiresAt) >= new Date(today)
      : false;

    // 3. Load Global Stats (Master Streak)
    const storedGlobal = localStorage.getItem(GLOBAL_KEY);
    let currentGlobal = INITIAL_GLOBAL;
    if (storedGlobal) {
      try {
        currentGlobal = JSON.parse(storedGlobal);
        // Check if Master Streak is broken
        const { isBroken } = calculateStreakStatus(currentGlobal.lastPerfectDate);
        if (isBroken && !isFreezeActive) {
          currentGlobal.masterStreak = 0;
        }
        setGlobalStats(currentGlobal);
      } catch (e) { console.error(e); }
    }

    // 4. Load Individual Streaks
    const storedStreaks = localStorage.getItem(STORAGE_KEY);
    if (storedStreaks) {
      try {
        const parsed: StreakData[] = JSON.parse(storedStreaks);
        
        // Ensure structure matches current INITIAL_DATA (handles adding new categories)
        // If parsed length differs from INITIAL_DATA, we might need to merge logic, 
        // but changing STORAGE_KEY version in types.ts is safer to reset for new features.
        
        // Process reset logic for individual streaks
        const updated = parsed.map(streak => {
          const { isBroken } = calculateStreakStatus(streak.lastCompletedDate);
          
          if (isBroken) {
            if (isFreezeActive) return streak;
            return { ...streak, currentStreak: 0 };
          }
          return streak;
        });
        
        setStreaks(updated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) { console.error(e); }
    } else {
      // If no storage (or new key), use initial data
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DATA));
    }
  }, []);

  const handleComplete = (id: string) => {
    const today = getTodayDateString();
    
    // 1. Update Individual Streak
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

    // 2. Check Master Streak & Coins Logic
    // Count how many tasks are done TODAY
    const completedTodayCount = updatedStreaks.filter(s => s.lastCompletedDate === today).length;
    // Dynamic check: if count equals total number of categories
    const allCompleted = completedTodayCount === updatedStreaks.length;

    // Update Global Stats (Master Streak) if all completed
    if (allCompleted && globalStats.lastPerfectDate !== today) {
      const newMasterStreak = globalStats.masterStreak + 1;
      const newGlobal = {
        masterStreak: newMasterStreak,
        lastPerfectDate: today
      };
      setGlobalStats(newGlobal);
      localStorage.setItem(GLOBAL_KEY, JSON.stringify(newGlobal));

      // COIN LOGIC: Earn 1 coin every 2 days of Master Streak
      // (e.g. Day 2, Day 4, Day 6...)
      if (newMasterStreak > 0 && newMasterStreak % 2 === 0) {
        const newWallet = {
          ...wallet,
          coins: wallet.coins + 1,
          lastCoinDate: today
        };
        setWallet(newWallet);
        localStorage.setItem(WALLET_KEY, JSON.stringify(newWallet));
      }
    }
  };

  const handleReset = (id: string) => {
    // Reset function logic if needed manually, though currently handled by useEffect
    const updatedStreaks = streaks.map(streak => {
      if (streak.id === id) {
        return { ...streak, currentStreak: 0, lastCompletedDate: null };
      }
      return streak;
    });
    setStreaks(updatedStreaks);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedStreaks));
  };

  const handleBuyFreeze = () => {
    if (wallet.coins >= 2) {
      const today = getTodayDateString();
      const expirationDate = addDays(today, 3);
      
      const updatedWallet = {
        ...wallet,
        coins: wallet.coins - 2,
        freezeExpiresAt: expirationDate
      };

      setWallet(updatedWallet);
      localStorage.setItem(WALLET_KEY, JSON.stringify(updatedWallet));
    }
  };

  const openMotivation = (category: CategoryType, message: string) => {
    setModalContent({ category, message });
    setMotivationModalOpen(true);
  };

  const isFreezeActive = wallet.freezeExpiresAt 
    ? new Date(wallet.freezeExpiresAt) >= new Date(getTodayDateString()) 
    : false;

  const today = getTodayDateString();
  const tasksDoneToday = streaks.filter(s => s.lastCompletedDate === today).length;
  
  // Show coin animation only if a coin was actually earned today
  const isCoinEarnedToday = wallet.lastCoinDate === today;

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
            
            <div className="flex items-center gap-4">
               {/* Store Button */}
               <button 
                onClick={() => setStoreModalOpen(true)}
                className="group flex items-center gap-2 bg-gray-800/50 hover:bg-gray-800 border border-gray-700/50 hover:border-yellow-500/50 px-3 py-1.5 rounded-lg transition-all"
               >
                  <Coins size={16} className="text-yellow-500 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-bold text-gray-200">{wallet.coins}</span>
               </button>

               <div className="flex flex-col items-end">
                  <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold flex items-center gap-1">
                    <Trophy size={10} className="text-yellow-500" />
                    Total
                  </span>
                  <span className="text-2xl font-black text-white leading-none tracking-tight">{globalStats.masterStreak}</span>
               </div>
            </div>
        </div>

        {/* Status Protection Banner */}
        {isFreezeActive && (
          <div className="mb-6 p-3 bg-blue-900/20 border border-blue-500/30 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
            <ShieldCheck size={20} className="text-blue-400" />
            <div className="flex-1">
              <p className="text-sm font-bold text-blue-200">Proteção Ativa</p>
              <p className="text-xs text-blue-400/80">
                Suas streaks estão salvas até {wallet.freezeExpiresAt?.split('-').reverse().join('/')}.
              </p>
            </div>
          </div>
        )}

        {/* Intro & Daily Progress */}
        <div className="mb-6 flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Foco no progresso.
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Complete tudo para subir a Streak Total.
            </p>
          </div>
          <div className="text-right pb-1">
             <span className="text-xs text-gray-500 font-medium">Progresso Diário</span>
             <div className="flex gap-1.5 mt-2 justify-end">
               {[1, 2, 3, 4].map((step) => (
                 <div 
                   key={step} 
                   className={`
                     w-2.5 h-2.5 rounded-full transition-all duration-300
                     ${step <= tasksDoneToday 
                        ? 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)] scale-110' 
                        : 'bg-gray-800'}
                   `}
                 />
               ))}
             </div>
             {isCoinEarnedToday && (
               <span className="text-[10px] text-yellow-500 font-bold block mt-1 animate-pulse">
                 +1 Moeda Ganha!
               </span>
             )}
          </div>
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

        {/* Footer Link */}
        <div className="mt-8 pt-4 flex justify-center pb-2">
          <a
            href="https://www.notion.so/250e64e8f1d3453d93bdf7349ad6f554"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 px-4 py-2 bg-gray-900/50 hover:bg-gray-800 rounded-full border border-gray-800 hover:border-blue-500/30 transition-all cursor-pointer"
          >
            <span className="text-xs font-medium text-gray-500 group-hover:text-blue-400 transition-colors">
              Sobre o Método TriStreak
            </span>
            <ExternalLink size={12} className="text-gray-600 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
          </a>
        </div>

      </main>

      <MotivationModal 
        isOpen={motivationModalOpen}
        onClose={() => setMotivationModalOpen(false)}
        category={modalContent.category}
        message={modalContent.message}
        isLoading={loadingMotivation}
      />

      <StoreModal 
        isOpen={storeModalOpen}
        onClose={() => setStoreModalOpen(false)}
        wallet={wallet}
        onBuyFreeze={handleBuyFreeze}
      />

    </div>
  );
}