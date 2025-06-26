import React from 'react';
import { Trash2 } from 'lucide-react';

export default function EmployeeTable({ employees, onDelete, onManage }) {
  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Selected Employees</h3>
        <button
          onClick={onManage}
          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Manage Employees
        </button>
      </div>
      <div className="overflow-x-auto bg-white dark:bg-gray-800 shadow rounded-lg">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-gray-600 dark:text-gray-300">Name</th>
              <th className="px-4 py-2 text-left text-gray-600 dark:text-gray-300">Rate</th>
              <th className="px-4 py-2 text-right"></th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr
                key={emp.id}
                onClick={onManage}
                className="cursor-pointer even:bg-gray-50 odd:bg-white dark:even:bg-gray-900 dark:odd:bg-gray-800"
              >
                <td className="px-4 py-2 text-gray-900 dark:text-gray-100">
                  {emp.firstName} {emp.lastName}
                </td>
                <td className="px-4 py-2 text-gray-900 dark:text-gray-100">
                  ${emp.rate.toFixed(2)}/hr
                </td>
                <td className="px-4 py-2 text-right">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(emp.id);
                    }}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                  >
                    <Trash2 className="h-5 w-5 text-red-500" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
