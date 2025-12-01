import React from 'react';
import { X, Sparkles } from 'lucide-react';
import { CategoryType } from '../types';

interface MotivationModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: CategoryType;
  message: string;
  isLoading: boolean;
}

export const MotivationModal: React.FC<MotivationModalProps> = ({ 
  isOpen, 
  onClose, 
  category, 
  message, 
  isLoading 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl p-6 transform transition-all scale-100">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center space-y-4">
          <div className="p-3 bg-purple-500/10 rounded-full text-purple-400">
            <Sparkles size={32} />
          </div>
          
          <h3 className="text-xl font-bold text-white">Coach Gemini diz:</h3>
          
          <div className="w-full min-h-[100px] flex items-center justify-center">
            {isLoading ? (
              <div className="flex space-x-2 animate-pulse">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            ) : (
              <p className="text-lg text-gray-200 italic leading-relaxed">
                "{message}"
              </p>
            )}
          </div>

          <div className="pt-4 w-full">
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-white text-black font-semibold rounded-xl hover:bg-gray-200 transition-colors"
            >
              Vamos lá!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};