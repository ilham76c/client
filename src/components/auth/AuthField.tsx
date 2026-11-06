'use client';

import { useState } from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

interface FieldProps {
  id: string;
  label: string;
  type?: 'text' | 'email' | 'password';
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  autoComplete?: string;
  hint?: string;
}

const inputClass =
  'w-full rounded-lg border bg-gray-900 px-3.5 py-2.5 text-sm text-white placeholder:text-gray-600 transition-colors focus:outline-none focus:ring-1';

export default function AuthField({
  id,
  label,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  autoComplete,
  hint,
}: FieldProps) {
  const [visible, setVisible] = useState(false);
  const isPassword = type === 'password';
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <div>
      <label
        htmlFor={id}
        className='block text-sm font-medium text-gray-300 mb-1.5'
      >
        {label}
      </label>

      <div className='relative'>
        <input
          id={id}
          type={isPassword && visible ? 'text' : type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          className={`${inputClass} ${isPassword ? 'pr-11' : ''} ${
            error
              ? 'border-red-500/60 focus:border-red-500/60 focus:ring-red-500/40'
              : 'border-gray-800 focus:border-emerald-500/50 focus:ring-emerald-500/50'
          }`}
        />

        {isPassword && (
          <button
            type='button'
            onClick={() => setVisible((v) => !v)}
            aria-label={
              visible ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'
            }
            className='absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1 text-gray-500 hover:text-gray-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50'
          >
            {visible ? (
              <VisibilityOffIcon sx={{ fontSize: 18 }} />
            ) : (
              <VisibilityIcon sx={{ fontSize: 18 }} />
            )}
          </button>
        )}
      </div>

      {error ? (
        <p id={`${id}-error`} className='mt-1.5 text-xs text-red-400'>
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className='mt-1.5 text-xs text-gray-600'>
          {hint}
        </p>
      ) : null}
    </div>
  );
}
