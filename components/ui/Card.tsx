
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div className={`bg-white/60 border border-slate-200 rounded-xl shadow-2xl backdrop-blur-lg animate-fade-in-up ${className}`}>
      {children}
    </div>
  );
};

export default Card;