
import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

const Textarea: React.FC<TextareaProps> = ({ error, className, ...props }) => {
  const baseClasses = "w-full px-4 py-3 bg-white/80 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 text-slate-900 placeholder-slate-400 min-h-[120px]";
  const borderClasses = error ? "border-red-500 focus:ring-red-500" : "border-slate-300 focus:ring-indigo-500 focus:border-indigo-500";
  
  return (
    <div className="w-full">
      <textarea
        className={`${baseClasses} ${borderClasses} ${className}`}
        {...props}
      ></textarea>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default Textarea;