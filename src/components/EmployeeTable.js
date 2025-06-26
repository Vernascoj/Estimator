import React from 'react';
import { Trash2 } from 'lucide-react';

export default function EmployeeTable({ employees, onDelete, onManage }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-white">Employees</h3>
        <button onClick={onManage} className="px-3 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600">
          Manage Employees
        </button>
      </div>
      <table className="min-w-full table-auto bg-white dark:bg-gray-800 shadow rounded-lg">
        <thead className="bg-gray-700">
          <tr>
            <th className="px-4 py-2 text-left text-white">Name</th>
            <th className="px-4 py-2 text-right text-white">Rate</th>
            <th className="px-4 py-2"></th>
          </tr>
        </thead>
        <tbody>
          {employees.length === 0 ? (
            <tr>
              <td colSpan={3} className="px-4 py-2 text-center text-gray-500">
                No employees selected.
              </td>
            </tr>
          ) : (
            employees.map(emp => (
              <tr
                key={emp.id}
                className="odd:bg-gray-100 even:bg-gray-200 dark:odd:bg-gray-800 dark:even:bg-gray-900"
              >
                <td className="px-4 py-2 dark:text-white">{emp.firstName} {emp.lastName}</td>
                <td className="px-4 py-2 text-right dark:text-white">${emp.rate.toFixed(2)}</td>
                <td className="px-4 py-2 text-right">
                  <button
                    onClick={() => onDelete(emp.id)}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                  >
                    <Trash2 className="h-5 w-5 text-red-500" />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
