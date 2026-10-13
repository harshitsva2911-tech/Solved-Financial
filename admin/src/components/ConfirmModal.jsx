import React, { useEffect } from 'react';
import { X, AlertTriangle } from 'lucide-react';

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'danger', // 'danger' | 'primary' | 'gold'
  loading = false,
  icon: CustomIcon,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !loading) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, loading, onClose]);

  if (!isOpen) return null;

  const getConfirmStyle = () => {
    if (confirmVariant === 'danger') {
      return {
        backgroundColor: '#DC2626',
        color: '#FFFFFF',
      };
    }
    if (confirmVariant === 'gold') {
      return {
        backgroundColor: '#D4B684',
        color: '#001B2F',
      };
    }
    return {
      backgroundColor: '#001B2F',
      color: '#FFFFFF',
    };
  };

  const IconComponent = CustomIcon || AlertTriangle;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity"
      onClick={() => {
        if (!loading) onClose();
      }}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
              style={{
                backgroundColor:
                  confirmVariant === 'danger'
                    ? '#FEE2E2'
                    : confirmVariant === 'gold'
                    ? '#FDF6EC'
                    : '#EEF2F6',
              }}
            >
              <IconComponent
                size={18}
                style={{
                  color:
                    confirmVariant === 'danger'
                      ? '#DC2626'
                      : confirmVariant === 'gold'
                      ? '#D4B684'
                      : '#001B2F',
                }}
              />
            </div>
            <h3 className="text-base font-semibold text-gray-900">{title}</h3>
          </div>
          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-50 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-5 text-sm text-gray-600 leading-relaxed">
          {typeof message === 'string' ? <p>{message}</p> : message}
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50/50 border-t border-gray-100">
          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 disabled:opacity-50 transition-colors"
          >
            {cancelText}
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            style={getConfirmStyle()}
            className="px-4 py-2 text-sm font-medium rounded-lg disabled:opacity-60 shadow-sm transition-opacity flex items-center gap-2"
          >
            {loading && (
              <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            )}
            <span>{confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
