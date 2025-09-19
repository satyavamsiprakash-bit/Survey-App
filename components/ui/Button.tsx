
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, className, ...props }) => {
  const baseClasses = "flex items-center justify-center w-full px-6 py-3 font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/50 transition-all duration-300 disabled:bg-slate-600 disabled:cursor-not-allowed transform hover:scale-105";
  
  return (
    <button className={`${baseClasses} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;