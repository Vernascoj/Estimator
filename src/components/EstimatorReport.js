import React from 'react';

export default function EstimatorReport({
  entries,
  employees,
  expenseItems,
  perDiemEnabled,
  perDiemDays,
  payrollBurden,
  avgExpense,
  profitPercent,
  setProfitPercent
}) {
  const workEntries = entries.filter(e => e.type === 'Work');
  const totalWork = workEntries.reduce((sum, e) => sum + e.duration, 0);
  const regHours = Math.min(totalWork, 8);
  const otHours = Math.max(totalWork - 8, 0);

  const avgRate = employees.length
    ? employees.reduce((sum, emp) => sum + Number(emp.rate), 0) / employees.length
    : 0;

  const baseRateCost = regHours * avgRate * employees.length;
  const otCost = otHours * avgRate * 1.5 * employees.length;
  const payrollCost = (baseRateCost + otCost) * payrollBurden;
  const totalLaborCost = baseRateCost + otCost + payrollCost;

  const avgExpenseCost = totalLaborCost * avgExpense;
  const profitExpensesCost = expenseItems
    .filter(item => item.profitable)
    .reduce((sum, item) => sum + item.cost, 0);
  const perDiemCost = perDiemEnabled ? employees.length * perDiemDays * 50 : 0;
  const allExpensesCost = expenseItems.reduce((sum, item) => sum + item.cost, 0);

  // Profit only on labor + avg expense + profit-flagged expenses
  const profitBase = totalLaborCost + avgExpenseCost + profitExpensesCost;
  const profitAmount = profitBase * profitPercent;

  const totalJobCost = profitBase + profitAmount + perDiemCost + (allExpensesCost - profitExpensesCost);

  return (
    <div className="bg-gray-800 rounded-lg shadow p-4 text-white">
      <h3 className="text-xl font-semibold mb-4">Cost Estimate</h3>
      <div className="mb-4 flex items-center space-x-2">
        <label>Profit %:</label>
        <input
          type="number"
          value={(profitPercent * 100).toFixed(0)}
          onChange={e => setProfitPercent(Number(e.target.value) / 100)}
          className="w-16 p-1 rounded bg-gray-700 text-white"
        />
      </div>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Base Rate</span>
          <span>${baseRateCost.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Overtime</span>
          <span>${otCost.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Payroll Burden</span>
          <span>${payrollCost.toFixed(2)}</span>
        </div>

        <div className="border-b border-gray-600 mt-2"></div>
        {avgExpenseCost > 0 && (
          <div className="flex justify-between">
            <span>Average Expense</span>
            <span>${avgExpenseCost.toFixed(2)}</span>
          </div>
        )}
        {allExpensesCost - profitExpensesCost > 0 && (
          <div className="flex justify-between">
            <span>Additional Expenses</span>
            <span>${(allExpensesCost - profitExpensesCost).toFixed(2)}</span>
          </div>
        )}
        {perDiemCost > 0 && (
          <div className="flex justify-between">
            <span>Per Diem</span>
            <span>${perDiemCost.toFixed(2)}</span>
          </div>
        )}

        <div className="border-t border-gray-600 mt-2"></div>
        <div className="flex justify-between">
          <span>Profit</span>
          <span>${profitAmount.toFixed(2)}</span>
        </div>
        <div className="border-t border-gray-600 mt-2"></div>
        <div className="flex justify-between font-bold">
          <span>Total Job Cost</span>
          <span>${totalJobCost.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
