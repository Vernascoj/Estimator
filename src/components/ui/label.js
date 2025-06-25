import React from 'react';

// Stub Label
export function Label({ children, htmlFor }) {
  return <label htmlFor={htmlFor}>{children}</label>;
}
