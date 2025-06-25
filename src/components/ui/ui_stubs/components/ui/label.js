import React from 'react';

export function Label({ children, htmlFor }) {
  return (
    <label htmlFor={htmlFor} className="font-semibold">
      {children}
    </label>
  );
}
