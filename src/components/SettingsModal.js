import React from 'react';

export default function SettingsModal({
  onClose,
  payrollBurden,
  avgExpense,
  profitPercent,
  driveRate,
  setPayrollBurden,
  setAvgExpense,
  setProfitPercent,
  setDriveRate
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
        <h2 className="text-lg font-semibold mb-4 text-black">Settings</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-black">Payroll Burden (%)</label>
            <input type="number"
              onFocus={e => e.target.select()} defaultValue={(payrollBurden * 100).toFixed(1)} onBlur={e => setPayrollBurden(Number(e.target.value) / 100)}
              className="w-full text-black rounded border p-1"
            />
          </div>
          <div>
            <label className="block text-sm text-black">Avg. Expense (%)</label>
            <input type="number"
              onFocus={e => e.target.select()} defaultValue={(avgExpense * 100).toFixed(1)} onBlur={e => setAvgExpense(Number(e.target.value) / 100)}
              className="w-full text-black rounded border p-1"
            />
          </div>
          <div>
            <label className="block text-sm text-black">Profit %</label>
            <input type="number"
              onFocus={e => e.target.select()} defaultValue={(profitPercent * 100).toFixed(1)} onBlur={e => setProfitPercent(Number(e.target.value) / 100)}
              className="w-full text-black rounded border p-1"
            />
          </div>
          <div>
            <label className="block text-sm text-black">Drive Rate ($/hr)</label>
            <input type="number"
              onFocus={e => e.target.select()} defaultValue={driveRate.toFixed(2)} onBlur={e => setDriveRate(Number(e.target.value))}
              className="w-full text-black rounded border p-1"
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
