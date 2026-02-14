import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

const Alert = ({ type = 'info', message, onClose }) => {
  const types = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      icon: CheckCircle,
      iconColor: 'text-green-400',
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: XCircle,
      iconColor: 'text-red-400',
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      icon: AlertCircle,
      iconColor: 'text-yellow-400',
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      icon: AlertCircle,
      iconColor: 'text-blue-400',
    },
  };

  const config = types[type];
  const Icon = config.icon;

  return (
    <div className={`${config.bg} ${config.border} border rounded-lg p-4 mb-4 flex items-start`}>
      <Icon className={`${config.iconColor} mr-3 flex-shrink-0`} size={20} />
      <p className={`${config.text} flex-1 text-sm`}>{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          className={`${config.text} hover:opacity-70 transition-opacity ml-3`}
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
};

export default Alert;
