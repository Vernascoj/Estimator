import React from 'react';

export default function SettingsModal({ onClose, payrollBurden, avgExpense, profitPercent, setPayrollBurden, setAvgExpense, setProfitPercent }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" onClick={onClose}>
      <div className="bg-white p-6 rounded shadow-lg max-w-md w-full" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Settings</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800 text-2xl leading-none">&times;</button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block mb-1">Payroll Burden (%)</label>
            <input type="number" step="0.001" value={payrollBurden} onChange={e => setPayrollBurden(Number(e.target.value))} className="w-full border px-2 py-1 rounded text-black" />
          </div>
          <div>
            <label className="block mb-1">Avg Expense (%)</label>
            <input type="number" step="0.001" value={avgExpense} onChange={e => setAvgExpense(Number(e.target.value))} className="w-full border px-2 py-1 rounded text-black" />
          </div>
          <div>
            <label className="block mb-1">Profit (%)</label>
            <input type="number" step="0.01" value={profitPercent} onChange={e => setProfitPercent(Number(e.target.value))} className="w-full border px-2 py-1 rounded text-black" />
          </div>
        </div>
      </div>
    </div>
);
}
