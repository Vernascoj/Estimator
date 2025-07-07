import React, { useState, useMemo, useEffect } from 'react';

export default function ExpenseSummary({ expenseItems }) {
  // Initialize local state with enabled flag
  const [localItems, setLocalItems] = useState(() =>
    expenseItems.map(item => ({ ...item, enabled: true }))
  );

  // Sync if props change without resetting enabled flags
  useEffect(() => {
    setLocalItems(current =>
      current.map((it, idx) => ({
        ...it,
        description: expenseItems[idx]?.description || it.description,
        cost: expenseItems[idx]?.cost ?? it.cost
      }))
    );
  }, [expenseItems]);

  // Compute total of enabled items
  const total = useMemo(
    () => localItems.filter(it => it.enabled).reduce((sum, it) => sum + it.cost, 0),
    [localItems]
  );

  // Toggle individual item
  const toggleItem = index => {
    setLocalItems(items =>
      items.map((it, i) => (i === index ? { ...it, enabled: !it.enabled } : it))
    );
  };

  return (
    <div className="bg-white dark:bg-gray-700 rounded-lg shadow p-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          Expense Summary
        </h3>
        <button
          onClick={() => setOpen(o => !o)}
          className="text-gray-800 dark:text-white"
        >
          {open ? 'Collapse' : 'Expand'}
        </button>
      </div>
      {open && (
        <ul className="text-gray-800 dark:text-gray-200 space-y-1">
          {localItems.map((item, idx) => (
            <li key={idx} className="flex justify-between items-center">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="form-checkbox"
                  checked={item.enabled}
                  onChange={() => toggleItem(idx)}
                />
                <span>{item.description}</span>
              </label>
              <span>${item.cost.toFixed(2)}</span>
            </li>
          ))}
          <li className="flex justify-between font-semibold border-t pt-2">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </li>
        </ul>
      )}
    </div>
  );
}