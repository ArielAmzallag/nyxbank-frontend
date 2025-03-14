import React, { ButtonHTMLAttributes } from 'react';
import styles from './Button.module.css';

type ButtonVariant = 'default' | 'ghost' | 'destructive' | 'outline';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'default', 
  size = 'medium',
  onClick, 
  disabled = false,
  type = 'button',
  fullWidth = false,
  className = '',
  ...props 
}) => {
  return (
    <button
      type={type}
      className={`${styles.button} ${styles[variant]} ${styles[size]} ${fullWidth ? styles.fullWidth : ''} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
