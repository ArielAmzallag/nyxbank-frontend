import React, { InputHTMLAttributes } from 'react';
import styles from './Input.module.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  className?: string;
}

const Input: React.FC<InputProps> = ({ 
  label,
  type = 'text',
  placeholder = '',
  onChange,
  value,
  name,
  error,
  fullWidth = false,
  className = '',
  ...props 
}) => {
  return (
    <div className={`${styles.inputWrapper} ${fullWidth ? styles.fullWidth : ''} ${className}`}>
      {label && <label className={styles.label}>{label}</label>}
      <input
        type={type}
        placeholder={placeholder}
        onChange={onChange}
        value={value}
        name={name}
        className={`${styles.input} ${error ? styles.error : ''}`}
        {...props}
      />
      {error && <p className={styles.errorMessage}>{error}</p>}
    </div>
  );
};

export default Input;
