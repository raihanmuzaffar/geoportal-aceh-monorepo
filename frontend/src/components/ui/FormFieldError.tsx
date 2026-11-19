import React from 'react';
import { AlertCircle } from 'lucide-react';

export interface FormFieldErrorProps {
  errors?: string[] | string | null;
  className?: string;
}

export const FormFieldError: React.FC<FormFieldErrorProps> = ({
  errors,
  className = '',
}) => {
  if (!errors) return null;

  const messages = Array.isArray(errors) ? errors : [errors];
  if (messages.length === 0) return null;

  return (
    <div className={`mt-1.5 space-y-1 text-xs text-rose-600 animate-in fade-in duration-100 ${className}`}>
      {messages.map((msg, index) => (
        <div key={index} className="flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{msg}</span>
        </div>
      ))}
    </div>
  );
};

export default FormFieldError;
