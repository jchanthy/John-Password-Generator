
import React from 'react';

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  description?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, checked, onChange, description }) => {
  return (
    <label className="flex items-start gap-3 cursor-pointer group p-2 rounded-lg hover:bg-white/5 transition-colors">
      <div className="relative flex items-center mt-0.5">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="peer sr-only"
        />
        <div className="w-5 h-5 border-2 border-slate-600 rounded bg-transparent peer-checked:bg-sky-500 peer-checked:border-sky-500 transition-all duration-200" />
        <i className="fa-solid fa-check absolute left-1 text-[10px] text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
          {label}
        </span>
        {description && (
          <span className="text-xs text-slate-500">{description}</span>
        )}
      </div>
    </label>
  );
};

export default Checkbox;
