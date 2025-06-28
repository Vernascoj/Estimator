import React from 'react';
import { Trash2 } from 'lucide-react';

export default function Expenses({ expenseItems, onUpdateExpense, onDeleteExpense }) {
  return (
    <div className="space-y-2">
      {expenseItems.length === 0 ? (
        <div className="text-gray-500">No expenses added.</div>
      ) : (
        expenseItems.map(item => (
          <div key={item.id} className="flex items-center space-x-4 p-2 bg-white rounded shadow">
            <input
              type="text"
              value={item.description}
              onChange={e => onUpdateExpense(item.id, { description: e.target.value })}
              placeholder="Description"
              className="flex-1 px-2 py-1 border rounded text-black"
            />
            <input
              type="number"
              defaultValue={item.cost}
              onChange={e => onUpdateExpense(item.id, { cost: Number(e.target.value) })}
              className="w-24 px-2 py-1 border rounded text-black text-right"
            />
            <button
              onClick={() => onDeleteExpense(item.id)}
              className="p-1 ml-2 sm:ml-4 text-red-500 hover:text-red-700 transition rounded"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        ))
      )}
    </div>
  );
}
