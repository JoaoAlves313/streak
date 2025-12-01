import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { StreakData, CategoryType } from '../types';

interface ChartSectionProps {
  streaks: StreakData[];
}

export const ChartSection: React.FC<ChartSectionProps> = ({ streaks }) => {
  const data = streaks.map(s => ({
    name: s.type,
    current: s.currentStreak,
    best: s.bestStreak,
    color: s.type === CategoryType.DEVELOPMENT ? '#3B82F6' : // blue-500
           s.type === CategoryType.NUTRITION ? '#10B981' :   // emerald-500
           '#F97316'                                         // orange-500
  }));

  return (
    <div className="w-full mt-8">
      <div className="flex items-center justify-between mb-4 px-1">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">
          Consistência Semanal
        </h3>
      </div>
      
      {/* Container com altura explícita para evitar erro do Recharts */}
      <div style={{ width: '100%', height: 150 }} className="bg-gray-900/30 rounded-2xl border border-gray-800/50 p-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }} barSize={12}>
            <XAxis type="number" hide />
            <YAxis 
              dataKey="name" 
              type="category" 
              tick={{ fill: '#9CA3AF', fontSize: 11, fontWeight: 500 }} 
              width={100}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip 
              cursor={{fill: 'rgba(255,255,255,0.03)'}}
              contentStyle={{ 
                backgroundColor: '#111827', 
                borderColor: '#374151', 
                borderRadius: '8px',
                fontSize: '12px',
                padding: '8px 12px'
              }}
              itemStyle={{ color: '#F3F4F6' }}
            />
            <Bar dataKey="current" radius={[0, 4, 4, 0]} background={{ fill: 'rgba(255,255,255,0.02)' }}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};