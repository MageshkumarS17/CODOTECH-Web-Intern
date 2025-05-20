import React from 'react';

interface InputProps {
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  id?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  label?: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  name,
  id,
  required = false,
  disabled = false,
  className = '',
  label,
  error,
}) => {
  const inputId = id || name;
  const inputClasses = `form-input ${error ? 'error' : ''} ${className}`;
  
  return (
    <div className="form-group">
      {label && (
        <label 
          htmlFor={inputId} 
          className="form-label"
        >
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        name={name}
        id={inputId}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={inputClasses}
      />
      {error && <p className="form-error">{error}</p>}
    </div>
  );
};

export default Input;