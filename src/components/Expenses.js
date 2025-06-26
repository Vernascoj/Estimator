import React from 'react';
import { Trash2 } from 'lucide-react';

export default function Expenses({
  expenseItems,
  onAddExpense,
  onUpdateExpense,
  onDeleteExpense
}) {
  return (
    <div>
      {expenseItems.length === 0 ? (
        <div className="text-gray-500 mb-2">No expenses added.</div>
      ) : (
        expenseItems.map(item => (
          <div
            key={item.id}
            className="flex items-center space-x-4 p-2 mb-2 bg-white dark:bg-gray-700 rounded shadow"
          >
            <input
              type="text"
              value={item.description}
              onChange={e => onUpdateExpense(item.id, { description: e.target.value })}
              placeholder="Description"
              className="flex-1 px-2 py-1 border rounded bg-gray-200 dark:bg-gray-600 text-white"
            />
            <input
              type="number"
              value={item.cost}
              onChange={e => onUpdateExpense(item.id, { cost: Number(e.target.value) })}
              className="w-24 px-2 py-1 border rounded bg-gray-200 dark:bg-gray-600 text-white"
            />
            <label className="flex items-center space-x-1 text-white">
              <input
                type="checkbox"
                checked={item.profitable}
                onChange={e => onUpdateExpense(item.id, { profitable: e.target.checked })}
                className="h-4 w-4"
              />
              <span>Profit?</span>
            </label>
            <button
              onClick={() => onDeleteExpense(item.id)}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
            >
              <Trash2 className="h-5 w-5 text-red-500" />
            </button>
          </div>
        ))
      )}
    </div>
  );
}
