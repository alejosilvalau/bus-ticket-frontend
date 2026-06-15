import type { InputHTMLAttributes } from 'react';

interface DateInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function DateInput({ label, error, className = '', id, ...props }: DateInputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        id={inputId}
        type="date"
        className={`w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-[#c60001] focus:outline-none focus:ring-1 focus:ring-[#c60001] ${error ? 'border-red-500' : ''} ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
