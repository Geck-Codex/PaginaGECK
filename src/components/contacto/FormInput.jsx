// src/components/ui/FormInput.jsx
import { useState } from 'react';

const FormInput = ({ 
  label, 
  type = 'text', 
  id, 
  placeholder, 
  value, 
  onChange, 
  required = false,
  options = [], // Para selects
  maxLength,
  rows = 4 // Para textarea
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (e) => {
    onChange(e.target.value);
  };

  const renderInput = () => {
    // Si es select
    if (type === 'select') {
      return (
        <select
          id={id}
          className="form-input"
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          required={required}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    }

    // Si es textarea
    if (type === 'textarea') {
      return (
        <textarea
          id={id}
          className="form-input form-textarea"
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          required={required}
          maxLength={maxLength}
          rows={rows}
        />
      );
    }

    // Input normal (text, email, etc)
    return (
      <input
        type={type}
        id={id}
        className="form-input"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        required={required}
        maxLength={maxLength}
      />
    );
  };

  return (
    <div className="form-group">
      {label && (
        <label className="form-label" htmlFor={id}>
          {label}
        </label>
      )}
      <div className="relative">
        {renderInput()}
        <div className={`input-glow ${isFocused ? 'active' : ''}`}></div>
      </div>
    </div>
  );
};

export default FormInput;