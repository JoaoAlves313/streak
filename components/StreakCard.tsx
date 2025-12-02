import React, { useState } from 'react';
import { Check, Flame, Brain, Dumbbell, Apple, Sparkles, Droplets } from 'lucide-react';
import { StreakData, CategoryType } from '../types';
import { getMotivationalTip } from '../services/geminiService';

interface StreakCardProps {
  data: StreakData;
  onComplete: (id: string) => void;
  onReset: (id: string) => void;
  onShowMotivation: (category: CategoryType, message: string) => void;
  setLoadingMotivation: (loading: boolean) => void;
}

export const StreakCard: React.FC<StreakCardProps> = ({ 
  data, 
  onComplete, 
  onShowMotivation,
  setLoadingMotivation 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Configuração de cores baseada no tipo
  const getConfig = () => {
    switch (data.type) {
      case CategoryType.DEVELOPMENT:
        return {
          icon: <Brain size={20} className="text-white" />,
          color: 'blue',
          bgStyle: 'bg-blue-500',
          borderStyle: 'border-blue-500/50',
          textStyle: 'text-blue-400',
          badgeStyle: 'bg-blue-500/20 text-blue-300'
        };
      case CategoryType.NUTRITION:
        return {
          icon: <Apple size={20} className="text-white" />,
          color: 'emerald',
          bgStyle: 'bg-emerald-500',
          borderStyle: 'border-emerald-500/50',
          textStyle: 'text-emerald-400',
          badgeStyle: 'bg-emerald-500/20 text-emerald-300'
        };
      case CategoryType.PHYSICAL:
        return {
          icon: <Dumbbell size={20} className="text-white" />,
          color: 'orange',
          bgStyle: 'bg-orange-500',
          borderStyle: 'border-orange-500/50',
          textStyle: 'text-orange-400',
          badgeStyle: 'bg-orange-500/20 text-orange-300'
        };
      case CategoryType.HYGIENE:
        return {
          icon: <Droplets size={20} className="text-white" />,
          color: 'cyan',
          bgStyle: 'bg-cyan-500',
          borderStyle: 'border-cyan-500/50',
          textStyle: 'text-cyan-400',
          badgeStyle: 'bg-cyan-500/20 text-cyan-300'
        };
    }
  };

  const config = getConfig();

  const handleMotivationClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setLoadingMotivation(true);
    onShowMotivation(data.type, ""); 
    const tip = await getMotivationalTip(data.type, data.currentStreak);
    onShowMotivation(data.type, tip); 
    setLoadingMotivation(false);
  };

  const today = new Date().toISOString().split('T')[0];
  const isCompletedToday = data.lastCompletedDate === today;

  return (
    <div 
      className={`group relative w-full flex items-center justify-between p-4 rounded-2xl border bg-gray-900/40 backdrop-blur-sm transition-all duration-300 hover:bg-gray-800/60 ${
        isCompletedToday ? config.borderStyle : 'border-gray-800 hover:border-gray-700'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Barra de progresso sutil no fundo */}
      <div 
        className={`absolute inset-y-0 left-0 opacity-5 transition-all duration-1000 ease-out z-0 ${config.bgStyle}`}
        style={{ width: `${Math.min((data.currentStreak / 30) * 100, 100)}%` }}
      />

      <div className="flex items-center gap-4 z-10">
        {/* Ícone */}
        <div className={`p-3 rounded-xl shadow-lg ${config.badgeStyle} ring-1 ring-inset ring-white/10`}>
          {config.icon}
        </div>
        
        {/* Textos */}
        <div className="flex flex-col">
          <h3 className="font-bold text-gray-100 text-base leading-tight">{data.type}</h3>
          <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mt-1">
             <span className={`flex items-center gap-1 ${data.currentStreak > 0 ? config.textStyle : ''}`}>
                <Flame size={12} className={data.currentStreak > 0 ? "fill-current" : ""} />
                {data.currentStreak} dias
             </span>
             <span className="text-gray-700">•</span>
             <span>Recorde: {data.bestStreak}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 z-10">
        {/* Botão de Motivação */}
        <button
          onClick={handleMotivationClick}
          className="p-2 text-gray-600 hover:text-purple-400 transition-colors rounded-lg hover:bg-white/5"
          title="Inspiração IA"
        >
          <Sparkles size={18} />
        </button>

        {/* Botão Check Principal */}
        <button
          onClick={() => !isCompletedToday && onComplete(data.id)}
          disabled={isCompletedToday}
          className={`
            flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 shadow-lg border
            ${isCompletedToday 
              ? `${config.bgStyle} border-transparent text-white scale-100 shadow-${config.color}-500/20` 
              : 'bg-gray-800 border-gray-700 text-gray-600 hover:bg-gray-700 hover:border-gray-600 hover:text-gray-300 hover:scale-105'
            }
          `}
        >
          {isCompletedToday ? (
            <Check size={24} strokeWidth={3} />
          ) : (
            <div className="w-1.5 h-1.5 rounded-full bg-gray-600 group-hover:bg-gray-400 transition-colors" />
          )}
        </button>
      </div>
    </div>
  );
};