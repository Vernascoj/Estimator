import React from 'react';

export default function SettingsModal({
  onClose,
  payrollBurden,
  avgExpense,
  profitPercent,
  driveRate,
  administrationPercent = 0.05,
  setPayrollBurden,
  setAvgExpense,
  setProfitPercent,
  setDriveRate,
  setAdministrationPercent
}) {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 p-4 rounded w-80"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold mb-4 text-black dark:text-white">Settings</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-black dark:text-white">Payroll Burden (%)</label>
            <input
              type="number"
              onFocus={e => e.target.select()}
              defaultValue={Math.round(payrollBurden * 100)}
              onBlur={e => setPayrollBurden(Number(e.target.value) / 100)}
              className="w-full rounded border p-1"
            />
          </div>
          <div>
            <label className="block text-sm text-black dark:text-white">Avg Expense (%)</label>
            <input
              type="number"
              onFocus={e => e.target.select()}
              defaultValue={Math.round(avgExpense * 100)}
              onBlur={e => setAvgExpense(Number(e.target.value) / 100)}
              className="w-full rounded border p-1"
            />
          </div>
          <div>
            <label className="block text-sm text-black dark:text-white">Profit Margin (%)</label>
            <input
              type="number"
              onFocus={e => e.target.select()}
              defaultValue={Math.round(profitPercent * 100)}
              onBlur={e => setProfitPercent(Number(e.target.value) / 100)}
              className="w-full rounded border p-1"
            />
          </div>
          <div>
            <label className="block text-sm text-black dark:text-white">Drive Rate ($/hr)</label>
            <input
              type="number"
              onFocus={e => e.target.select()}
              defaultValue={driveRate}
              onBlur={e => setDriveRate(Number(e.target.value))}
              className="w-full rounded border p-1"
            />
          </div>
          <div>
            <label className="block text-sm text-black dark:text-white">Administration (%)</label>
            <input
              type="number"
              onFocus={e => e.target.select()}
              defaultValue={Math.round(administrationPercent * 100)}
              onBlur={e => setAdministrationPercent(Number(e.target.value) / 100)}
              className="w-full rounded border p-1"
            />
          </div>
        </div>
        <div className="mt-4 text-right">
          <button
            onClick={onClose}
            className="px-3 py-1 bg-indigo-500 text-white rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
