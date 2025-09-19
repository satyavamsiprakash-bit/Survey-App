
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div className={`bg-slate-800/50 border border-slate-700 rounded-xl shadow-2xl backdrop-blur-lg ${className}`}>
      {children}
    </div>
  );
};

export default Card;