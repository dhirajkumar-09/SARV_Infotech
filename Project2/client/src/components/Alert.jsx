import React from 'react';
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react';

const Alert = ({ type = 'error', message, className = '' }) => {
  if (!message) return null;

  const styles = {
    error: {
      bg: 'bg-red-50 dark:bg-red-950/50',
      border: 'border-red-200 dark:border-red-900/60',
      text: 'text-red-700 dark:text-red-300',
      icon: <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />,
    },
    success: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/50',
      border: 'border-emerald-200 dark:border-emerald-900/60',
      text: 'text-emerald-700 dark:text-emerald-300',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    },
    warning: {
      bg: 'bg-amber-50 dark:bg-amber-950/50',
      border: 'border-amber-200 dark:border-amber-900/60',
      text: 'text-amber-700 dark:text-amber-300',
      icon: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
    },
    info: {
      bg: 'bg-indigo-50 dark:bg-indigo-950/50',
      border: 'border-indigo-200 dark:border-indigo-900/60',
      text: 'text-indigo-700 dark:text-indigo-300',
      icon: <Info className="w-5 h-5 text-indigo-500 shrink-0" />,
    },
  };

  const current = styles[type] || styles.error;

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-2xl border text-sm font-medium ${current.bg} ${current.border} ${current.text} ${className}`}
      role="alert"
    >
      {current.icon}
      <div className="flex-1">{message}</div>
    </div>
  );
};

export default Alert;
