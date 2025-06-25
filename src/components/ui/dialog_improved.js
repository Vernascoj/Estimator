import React from 'react';

export function Dialog({ open, onOpenChange, children }) {
  // Only render dialog when open
  return open ? <>{children}</> : null;
}

export function DialogTrigger({ asChild, children }) {
  // Expect a single child element to toggle open
  const child = React.Children.only(children);
  return React.cloneElement(child, {
    onClick: () => child.props.onClick && child.props.onClick(),
  });
}

export function DialogContent({ children, className }) {
  // Centered overlay
  return (
    <div className={(className || '') + ' fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'}>
      <div className="bg-white p-4 rounded">
        {children}
      </div>
    </div>
  );
}

export function DialogHeader({ children }) {
  return <div className="mb-4">{children}</div>;
}

export function DialogTitle({ children }) {
  return <h2 className="text-xl font-bold">{children}</h2>;
}

export function DialogDescription({ children }) {
  return <p className="mt-2 text-sm text-gray-600">{children}</p>;
}

export function DialogFooter({ children }) {
  return <div className="mt-4 flex justify-end space-x-2">{children}</div>;
}

export function DialogClose({ children, onClick }) {
  // Button to close
  return (
    <button onClick={onClick} className="px-3 py-1 bg-gray-200 rounded">
      {children}
    </button>
  );
}
