import React from 'react';

// Stub Select components
export function Select({ children, value, onValueChange }) {
  return <div>{children}</div>;
}
export function SelectTrigger({ children }) {
  return <div>{children}</div>;
}
export function SelectValue({ placeholder }) {
  return <span>{placeholder}</span>;
}
export function SelectContent({ children }) {
  return <div>{children}</div>;
}
export function SelectItem({ value, children }) {
  return <div onClick={() => {}}>{children}</div>;
}
