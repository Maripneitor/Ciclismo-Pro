import { useState } from 'react';
import './FloatingInput.css';

function FloatingInput({ 
  id, 
  label, 
  type = 'text', 
  value, 
  onChange, 
  required = false, 
  disabled = false,
  placeholder = '',
  error = ''
}) {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const hasValue = value !== '';
  const shouldFloat = isFocused || hasValue;

  return (
    <div className={`floating-input-group ${error ? 'has-error' : ''}`}>
      <div className="input-wrapper">
        <input
          type={type}
          id={id}
          className="floating-input"
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          required={required}
          disabled={disabled}
          placeholder={placeholder}
        />
        <label 
          htmlFor={id} 
          className={`floating-label ${shouldFloat ? 'floating-label--float' : ''}`}
        >
          {label}
          {required && <span className="required-asterisk">*</span>}
        </label>
      </div>
      {error && <span className="input-error">{error}</span>}
    </div>
  );
}

export default FloatingInput;