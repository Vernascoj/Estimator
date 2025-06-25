import React from 'react';

// Stub Dialog components
export function Dialog({ open, onOpenChange, children }) {
  return <div>{children}</div>;
}
export function DialogTrigger({ asChild, children }) {
  return <span onClick={() => {}}>{children}</span>;
}
export function DialogContent({ children }) {
  return <div>{children}</div>;
}
export function DialogHeader({ children }) {
  return <div>{children}</div>;
}
export function DialogTitle({ children }) {
  return <h2>{children}</h2>;
}
export function DialogDescription({ children }) {
  return <p>{children}</p>;
}
export function DialogFooter({ children }) {
  return <div>{children}</div>;
}
export function DialogClose({ children }) {
  return <button>{children}</button>;
}
