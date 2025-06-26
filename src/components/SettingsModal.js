import React from 'react';

export default function SettingsModal({
  onClose,
  payrollBurden,
  setPayrollBurden,
  expensePercent,
  setExpensePercent,
  driveTime,
  setDriveTime,
  darkMode,
  setDarkMode
}) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-900 p-6 rounded w-80">
        <h2 className="text-xl mb-4 text-gray-900 dark:text-gray-100">Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1">
              Payroll Burden (%)
            </label>
            <input
              type="number"
              value={payrollBurden}
              onChange={(e) => setPayrollBurden(Number(e.target.value))}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1">
              Average Expenses (%)
            </label>
            <input
              type="number"
              value={expensePercent}
              onChange={(e) => setExpensePercent(Number(e.target.value))}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1">
              Drive Time ($/hr)
            </label>
            <input
              type="number"
              value={driveTime}
              onChange={(e) => setDriveTime(Number(e.target.value))}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="flex items-center space-x-2">
            <input
              id="darkMode"
              type="checkbox"
              checked={darkMode}
              onChange={(e) => setDarkMode(e.target.checked)}
            />
            <label htmlFor="darkMode" className="text-gray-700 dark:text-gray-300">
              Dark Mode
            </label>
          </div>
        </div>
        <div className="text-right mt-6">
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
