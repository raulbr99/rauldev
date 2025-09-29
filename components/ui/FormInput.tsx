// components/ui/FormInput.tsx
'use client';

import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface FormInputProps {
    id: string;
    name: string;
    label: string;
    type?: 'text' | 'email' | 'textarea';
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    error?: string;
    touched: boolean;
    placeholder?: string;
    rows?: number;
    maxLength?: number;
    showCharCount?: boolean;
}

export default function FormInput({
    id,
    name,
    label,
    type = 'text',
    value,
    onChange,
    onBlur,
    error,
    touched,
    placeholder,
    rows = 5,
    maxLength,
    showCharCount = false
}: FormInputProps) {
    const hasError = touched && error;
    const isValid = touched && !error && value;

    const inputClasses = `w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none transition-colors ${hasError
        ? 'border-red-500 focus:border-red-500'
        : isValid
            ? 'border-green-500 focus:border-green-500'
            : 'border-white/20 focus:border-blue-400'
        } ${type === 'textarea' ? 'resize-none' : ''}`;

    return (
        <div>
            <div className="flex justify-between items-center mb-2">
                <label htmlFor={id} className="block text-white font-medium">
                    {label}
                </label>
                {showCharCount && maxLength && (
                    <span className={`text-xs ${value.length > maxLength ? 'text-red-400' : 'text-gray-400'
                        }`}>
                        {value.length}/{maxLength}
                    </span>
                )}
            </div>

            <div className="relative">
                {type === 'textarea' ? (
                    <textarea
                        id={id}
                        name={name}
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        rows={rows}
                        className={inputClasses}
                        placeholder={placeholder}
                        maxLength={maxLength}
                        aria-invalid={hasError ? "true" : "false"}
                        aria-describedby={hasError ? `${id}-error` : undefined}
                    />
                ) : (
                    <input
                        type={type}
                        id={id}
                        name={name}
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        className={inputClasses}
                        placeholder={placeholder}
                        maxLength={maxLength}
                        aria-invalid={hasError ? "true" : "false"}
                        aria-describedby={hasError ? `${id}-error` : undefined}
                    />
                )}

                {isValid && (
                    <CheckCircle className="absolute right-3 top-3 w-5 h-5 text-green-500" />
                )}
                {hasError && (
                    <XCircle className="absolute right-3 top-3 w-5 h-5 text-red-500" />
                )}
            </div>

            {hasError && (
                <p id={`${id}-error`} className="mt-1 text-sm text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                </p>
            )}
        </div>
    );
}