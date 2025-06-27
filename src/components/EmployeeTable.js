import React from 'react';
import { Trash2 } from 'lucide-react';

export default function EmployeeTable({
  employees,
  onDelete,
  onManage,
  onToggleType,
  employeeTypes
}) {
  return (
    <div className="bg-white p-4 rounded space-y-2">
      <button onClick={onManage} className="px-3 py-1 bg-indigo-500 text-white rounded">
        Manage Employees
      </button>
      {employees.map(emp => (
        <div
          key={emp.id}
          className="w-full flex justify-between items-center bg-gray-100 p-2 rounded hover:bg-gray-200"
        >
          <div className="flex items-center space-x-2">
            <div className="flex-1">
              <div className="font-medium">{emp.firstName} {emp.lastName}</div>
              <div className="text-sm text-gray-600">${emp.rate.toFixed(2)}/hr</div>
            </div>
            <button
              onClick={() => onToggleType(emp.id)}
              className="px-2 py-1 border rounded hover:bg-gray-50"
            >
              {employeeTypes[emp.id] || 'Hourly'}
            </button>
          </div>
          <button
            onClick={() => onDelete(emp.id)}
            className="p-1 hover:bg-gray-200 rounded"
          >
            <Trash2 className="h-5 w-5 text-red-500" />
          </button>
        </div>
      ))}
    </div>
);
}
