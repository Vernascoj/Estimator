import React from 'react';

export function Select({ value, onValueChange, children }) {
  return <div>{children}</div>;
}

export function SelectTrigger({ children, className }) {
  return <div className={className}>{children}</div>;
}

export function SelectValue({ placeholder, className, value }) {
  return <span className={className}>{value || placeholder}</span>;
}

export function SelectContent({ children }) {
  return <div className="absolute bg-white border">{children}</div>;
}

export function SelectItem({ value, children, className, onClick }) {
  return (
    <div onClick={() => onClick(value)} className={className}>
      {children}
    </div>
  );
}
