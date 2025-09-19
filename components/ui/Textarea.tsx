
import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

const Textarea: React.FC<TextareaProps> = ({ error, className, ...props }) => {
  const baseClasses = "w-full px-4 py-3 bg-slate-800 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 text-slate-200 placeholder-slate-500 min-h-[120px]";
  const borderClasses = error ? "border-red-500 focus:ring-red-500" : "border-slate-700 focus:ring-indigo-500 focus:border-indigo-500";
  
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