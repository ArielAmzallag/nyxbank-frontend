import React, { HTMLAttributes } from 'react';
import styles from './Card.module.css';

type CardVariant = 'default' | 'elevated';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  className?: string;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  variant = 'default', 
  className = '',
  ...props 
}) => {
  return (
    <div
      className={`${styles.card} ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;