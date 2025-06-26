import React from 'react';

export default function ManageEmployeesModal({
  onClose,
  employees,
  includedMap,
  onToggleInclude
}) {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg w-96">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Manage Employees</h2>
        <div className="space-y-2 max-h-60 overflow-auto">
          {employees.map((emp) => (
            <div
              key={emp.id}
              onClick={() => onToggleInclude(emp.id)}
              className={`p-3 rounded-lg cursor-pointer flex justify-between items-center ${
                includedMap[emp.id]
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
              }`}
            >
              <span>{emp.firstName} {emp.lastName}</span>
              <span>{includedMap[emp.id] ? 'Included' : 'Excluded'}</span>
            </div>
          ))}
        </div>
        <div className="text-right mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
