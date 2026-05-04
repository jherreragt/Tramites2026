import React, { useEffect } from 'react';
import { AlertCircle, X, CheckCircle2, Info } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'error' | 'success' | 'info';
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, type = 'error', onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const icons = {
    error: <AlertCircle className="h-5 w-5 text-red-500" />,
    success: <CheckCircle2 className="h-5 w-5 text-green-500" />,
    info: <Info className="h-5 w-5 text-blue-500" />
  };

  const colors = {
    error: 'border-red-100 bg-red-50 text-red-800',
    success: 'border-green-100 bg-green-50 text-green-800',
    info: 'border-blue-100 bg-blue-50 text-blue-800'
  };

  return (
    <div className="fixed top-24 right-8 z-[100] animate-in fade-in slide-in-from-right-8 duration-300">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-lg ${colors[type]}`}>
        {icons[type]}
        <p className="text-sm font-semibold pr-4">{message}</p>
        <button 
          onClick={onClose}
          className="p-1 hover:bg-black/5 rounded-full transition-colors"
        >
          <X className="h-4 w-4 opacity-50" />
        </button>
      </div>
    </div>
  );
};

export default Toast;
