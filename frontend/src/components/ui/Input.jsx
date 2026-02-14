const Input = ({ 
  label, 
  error, 
  type = 'text', 
  id,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  className = '',
  ...props 
}) => {
  const inputId = id || name;

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label htmlFor={inputId} className="label">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        id={inputId}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`input ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Input;
