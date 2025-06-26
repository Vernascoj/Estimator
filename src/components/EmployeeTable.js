import React from 'react';
import { Trash2 } from 'lucide-react';

export default function EmployeeTable({ employees, onDelete, onManage }) {
  return (
    <div className="bg-white p-4 rounded space-y-2">
      {employees.map(emp => (
        <button
          key={emp.id}
          onClick={() => onManage(emp.id)}
          className="w-full flex justify-between items-center bg-gray-100 p-2 rounded hover:bg-gray-200"
        >
          <div>
            <div className="font-medium">{emp.firstName} {emp.lastName}</div>
            <div className="text-sm text-gray-600">${emp.rate.toFixed(2)}/hr</div>
          </div>
          <button
            onClick={e => { e.stopPropagation(); onDelete(emp.id); }}
            className="p-1 hover:bg-gray-200 rounded"
          >
            <Trash2 className="h-5 w-5 text-red-500" />
          </button>
        </button>
      ))}
    </div>
  );
}
