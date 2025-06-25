import React from 'react';

export function Button({ children, variant, className, onClick }) {
  return (
    <button onClick={onClick} className={className}>
      {children}
    </button>
  );
}
