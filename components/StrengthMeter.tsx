
import React from 'react';
import { StrengthInfo } from '../types';

interface StrengthMeterProps {
  info: StrengthInfo;
}

const StrengthMeter: React.FC<StrengthMeterProps> = ({ info }) => {
  return (
    <div className="w-full mt-6">
      <div className="flex justify-between items-end mb-2">
        <span className="text-sm font-medium text-slate-400">Security Strength</span>
        <span className={`text-sm font-bold uppercase tracking-wider transition-colors duration-300 ${info.color.replace('bg-', 'text-')}`}>
          {info.level}
        </span>
      </div>
      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-500 ease-out ${info.color}`}
          style={{ width: `${info.score}%` }}
        />
      </div>
      <p className="text-[10px] text-slate-500 mt-2 text-right">
        Estimated Entropy: {info.entropy.toFixed(1)} bits
      </p>
    </div>
  );
};

export default StrengthMeter;
