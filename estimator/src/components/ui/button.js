import React from 'react';

// Stub Button
export function Button({ children, variant, onClick }) {
  return <button onClick={onClick}>{children}</button>;
}
