import React, { useMemo } from 'react';
import { Trash2 } from 'lucide-react';

export default function EmployeeTable({
  employees,
  onDelete,
  onManage,
  onToggleType,
  employeeTypes
}) {
  // Compute average hourly rate for selected employees
  const averageRate = useMemo(() => {
    if (employees.length === 0) return 0;
    const total = employees.reduce((sum, emp) => sum + emp.rate, 0);
    return total / employees.length;
  }, [employees]);

  return (
    <div className="bg-white p-4 rounded">
      {/* Header: Manage button and average rate */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={onManage}
          className="px-3 py-1 bg-indigo-500 text-white rounded"
        >
          Manage Employees
        </button>
        <div className="text-gray-700 font-medium">
          Avg Rate: ${averageRate.toFixed(2)}/hr
        </div>
      </div>

      {/* Employee list */}
      <div className="space-y-2">
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
    </div>
  );
}
