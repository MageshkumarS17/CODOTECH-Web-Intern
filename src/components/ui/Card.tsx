import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hover = false,
}) => {
  const baseClass = 'card';
  const hoverClass = hover ? 'card-hover' : '';
  const clickClass = onClick ? 'cursor-pointer' : '';
  
  const cardClasses = [
    baseClass,
    hoverClass,
    clickClass,
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div
      className={cardClasses}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => (
  <div className={`card-header ${className}`}>
    {children}
  </div>
);

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => (
  <div className={`card-content ${className}`}>
    {children}
  </div>
);

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => (
  <div className={`card-footer ${className}`}>
    {children}
  </div>
);

export default Card;