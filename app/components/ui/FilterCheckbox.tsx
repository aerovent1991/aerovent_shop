import React from 'react';
import { Check } from 'lucide-react';
interface FilterCheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}
export function FilterCheckbox({
  label,
  checked,
  onChange
}: FilterCheckboxProps) {
  return (
    <label className="flex items-center space-x-3 cursor-pointer group">
      <div
        className={`w-5 h-5 border flex items-center justify-center transition-all duration-200 ${checked ? 'bg-aero-accent border-aero-accent' : 'bg-transparent border-white/20 group-hover:border-aero-accent'}`}>

        {checked &&
        <Check className="w-3.5 h-3.5 text-black" strokeWidth={3} />
        }
      </div>
      <input
        type="checkbox"
        className="hidden"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)} />

      <span
        className={`text-sm transition-colors ${checked ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>

        {label}
      </span>
    </label>);

}