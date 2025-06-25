import React from 'react';

export function Dialog({ open, onOpenChange, children }) {
  return <>{children}</>;
}

export function DialogTrigger({ asChild, children }) {
  return <>{children}</>;
}
// src/components/ui/dialog.js
import React from 'react';

export function Dialog({ open, onOpenChange, children }) {
  return <>{children}</>;
}

export function DialogTrigger({ asChild, children }) {
  return <>{children}</>;
}

export function DialogContent({ children, className }) {
  return (
    <div
      className={
        (className || '') +
        ' fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'
      }
    >
      {children}
    </div>
  );
}

export function DialogHeader({ children }) {
  return <div className="p-4">{children}</div>;
}

export function DialogTitle({ children }) {
  return <h2 className="text-xl font-bold">{children}</h2>;
}

export function DialogDescription({ children }) {
  return <p className="mt-2">{children}</p>;
}

export function DialogFooter({ children }) {
  return <div className="p-4">{children}</div>;
}

export function DialogClose({ children, onClick }) {
  return <button onClick={onClick}>{children}</button>;
}
export function DialogContent({ children, className }) {
  return (
    <div className={\`\${className} fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center\`}>
      {children}
    </div>
  );
}

export function DialogHeader({ children }) {
  return <div className="p-4">{children}</div>;
}

export function DialogTitle({ children }) {
  return <h2 className="text-xl font-bold">{children}</h2>;
}

export function DialogDescription({ children }) {
  return <p className="mt-2">{children}</p>;
}

export function DialogFooter({ children }) {
  return <div className="p-4">{children}</div>;
}

export function DialogClose({ children, onClick }) {
  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}

