import React from 'react';
import { X } from 'lucide-react';

export default function ManageEmployeesModal({
  employees,
  includedMap,
  onToggleInclude,
  onSelectAll,
  onDeselectAll,
  onClose
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" onClick={onClose}>
      <div className="bg-white p-4 rounded max-h-full overflow-y-auto w-96" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Manage Employees</h2>
          <button onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        <div className="flex space-x-2 mb-4">
          <button onClick={onSelectAll} className="flex-1 px-3 py-1 bg-green-500 text-white rounded">Add All</button>
          <button onClick={onDeselectAll} className="flex-1 px-3 py-1 bg-red-500 text-white rounded">Remove All</button>
        </div>
        <div className="space-y-2">
          {employees.map(emp => (
            <label key={emp.id} className="flex justify-between items-center bg-gray-100 p-2 rounded">
              <div className="flex items-center space-x-2">
<input
                type="checkbox"
                checked={includedMap[emp.id]}
                onChange={() => onToggleInclude(emp.id)}
              />
              <span>{emp.firstName} {emp.lastName}</span>
              </div>
              <span className="font-medium">{'$'+emp.rate.toFixed(2)}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
