import React from 'react';
import { X, ShoppingBag, Shield, Coins } from 'lucide-react';
import { Wallet } from '../types';

interface StoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallet: Wallet;
  onBuyFreeze: () => void;
}

export const StoreModal: React.FC<StoreModalProps> = ({ 
  isOpen, 
  onClose, 
  wallet,
  onBuyFreeze
}) => {
  if (!isOpen) return null;

  const isFreezeActive = wallet.freezeExpiresAt 
    ? new Date(wallet.freezeExpiresAt) >= new Date(new Date().toISOString().split('T')[0]) 
    : false;

  const canAfford = wallet.coins >= 2;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden transform transition-all scale-100">
        
        {/* Header */}
        <div className="bg-gray-800/50 p-6 flex items-center justify-between border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-500/20 p-2 rounded-lg text-yellow-500">
              <ShoppingBag size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Loja de Itens</h3>
              <p className="text-xs text-gray-400">Troque suas moedas por vantagens</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Balance */}
        <div className="px-6 py-4 bg-gray-900 flex items-center justify-between border-b border-gray-800">
          <span className="text-sm font-medium text-gray-400">Seu Saldo:</span>
          <div className="flex items-center gap-2 bg-yellow-500/10 px-3 py-1.5 rounded-full border border-yellow-500/20">
            <Coins size={16} className="text-yellow-400" />
            <span className="font-bold text-yellow-400">{wallet.coins} Moedas</span>
          </div>
        </div>

        {/* Items List */}
        <div className="p-6">
          <div className="bg-gray-800/40 rounded-xl p-4 border border-gray-700 hover:border-blue-500/50 transition-colors group">
            <div className="flex items-start justify-between">
              <div className="flex gap-4">
                <div className={`p-3 rounded-xl ${isFreezeActive ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-700 text-gray-400'}`}>
                  <Shield size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-100">Bloqueador de Streak</h4>
                  <p className="text-xs text-gray-400 mt-1 max-w-[200px]">
                    Protege suas sequências por 3 dias. Se esquecer de marcar, o contador não zera.
                  </p>
                  {isFreezeActive && (
                    <p className="text-xs text-blue-400 mt-2 font-medium">
                      Ativo até: {wallet.freezeExpiresAt?.split('-').reverse().join('/')}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="text-sm font-bold text-yellow-500 flex items-center gap-1">
                  2 <Coins size={12} />
                </span>
                
                {!isFreezeActive ? (
                  <button
                    onClick={onBuyFreeze}
                    disabled={!canAfford}
                    className={`
                      px-4 py-2 rounded-lg text-xs font-bold transition-all
                      ${canAfford 
                        ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20' 
                        : 'bg-gray-700 text-gray-500 cursor-not-allowed'}
                    `}
                  >
                    Comprar
                  </button>
                ) : (
                  <span className="px-3 py-1.5 bg-green-500/20 text-green-400 text-xs font-bold rounded-lg border border-green-500/30">
                    Ativo
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="bg-gray-950 p-4 text-center">
          <p className="text-[10px] text-gray-600">
            Complete todos os hábitos por 2 dias seguidos (Total) para ganhar 1 moeda.
          </p>
        </div>

      </div>
    </div>
  );
};