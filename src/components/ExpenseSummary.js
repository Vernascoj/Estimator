import React, { useState, useMemo } from 'react';

export default function ExpenseSummary({ expenseItems }) {
  const [open, setOpen] = useState(false);
  const total = useMemo(() => expenseItems.reduce((sum, it) => sum + it.cost, 0), [expenseItems]);

  return (
    <div className="bg-white dark:bg-gray-700 rounded-lg shadow p-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Expense Summary</h3>
        <button onClick={() => setOpen(o => !o)} className="text-gray-800 dark:text-white">
          {open ? 'Collapse' : 'Expand'}
        </button>
      </div>
      {open && (
        <div className="text-gray-800 dark:text-gray-200">
          {expenseItems.length === 0 ? (
            <div className="text-sm">No additional expenses.</div>
          ) : (
            <ul className="list-disc pl-6 space-y-1">
              {expenseItems.map(item => (
                <li key={item.id} className="flex justify-between">
                  <span>{item.description || 'Expense'}</span>
                  <span>${item.cost.toFixed(2)}</span>
                </li>
              ))}
              <li className="flex justify-between font-semibold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </li>
            </ul>
          )}
        </div>
      )}
    </div>
);
}
