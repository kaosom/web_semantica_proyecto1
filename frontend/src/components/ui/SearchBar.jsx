import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

/**
 * SearchBar: modo controlado (value + onChange) o no controlado (onSearch con delay).
 * - Si se pasan value y onChange, el padre controla el valor y puede reaplicar filtros al recargar datos.
 * - Si solo se pasa onSearch, usa estado interno y llama onSearch tras el delay.
 */
const SearchBar = ({
  onSearch,
  placeholder = 'Buscar...',
  delay = 300,
  value: controlledValue,
  onChange: controlledOnChange,
}) => {
  const [internalValue, setInternalValue] = useState('');
  const isControlled = controlledValue !== undefined;

  const displayValue = isControlled ? controlledValue : internalValue;

  useEffect(() => {
    if (isControlled) return;
    const timer = setTimeout(() => {
      onSearch?.(internalValue);
    }, delay);
    return () => clearTimeout(timer);
  }, [internalValue, delay, isControlled, onSearch]);

  const handleChange = (e) => {
    const v = e.target.value;
    if (isControlled && controlledOnChange) {
      controlledOnChange(e);
    } else {
      setInternalValue(v);
    }
  };

  const handleClear = () => {
    if (isControlled && controlledOnChange) {
      controlledOnChange({ target: { value: '' } });
    } else {
      setInternalValue('');
      onSearch?.('');
    }
  };

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="text-gray-400" size={20} />
      </div>
      <input
        type="text"
        value={displayValue}
        onChange={handleChange}
        placeholder={placeholder}
        className="input pl-10 pr-10"
        aria-label="Buscar"
      />
      {displayValue && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
          aria-label="Limpiar búsqueda"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
