import React, { useState } from 'react';

export default function EstimatorReport({
  entries,
  employees,
  expenseItems,
  perDiemEnabled,
  perDiemDays,
  payrollBurden,
  avgExpense,
  profitPercent,
  setProfitPercent,
  driveRate
}) {
  const peopleCount = employees.length;

  // Calculate labor hours
  let cumulative = 0;
  let workReg = 0, workOt1 = 0, workOt2 = 0;
  let driveReg = 0, driveOt1 = 0, driveOt2 = 0;

  entries.forEach(e => {
    const dur = e.duration;
    let rem = dur;
    const reg = Math.min(rem, Math.max(0, 8 - cumulative)); rem -= reg;
    const ot1 = Math.min(rem, Math.max(0, 12 - (cumulative + reg))); rem -= ot1;
    const ot2 = rem; cumulative += dur;

    if (e.type === 'Work') {
      workReg += reg; workOt1 += ot1; workOt2 += ot2;
    } else {
      driveReg += reg; driveOt1 += ot1; driveOt2 += ot2;
    }
  });

  // Employee rate sum
  const empRateSum = employees.reduce((sum, emp) => sum + emp.rate, 0);

  // Costs
  const baseRegCost = workReg * empRateSum + driveReg * driveRate * peopleCount;
  const overtimeCost =
    workOt1 * empRateSum * 1.5 +
    workOt2 * empRateSum * 2 +
    driveOt1 * driveRate * 1.5 * peopleCount +
    driveOt2 * driveRate * 2 * peopleCount;
  const payrollCost = (baseRegCost + overtimeCost) * payrollBurden;

  const avgExpenseCost = (baseRegCost + overtimeCost) * avgExpense;
  const perDiemCost = perDiemEnabled ? peopleCount * perDiemDays * 50 : 0;
  const additionalCost = expenseItems.reduce((sum, item) => sum + item.cost, 0);

  const profitExpensesCost = expenseItems.filter(item => item.profitable)
    .reduce((sum, item) => sum + item.cost, 0);
  const profitBase = baseRegCost + overtimeCost + avgExpenseCost + profitExpensesCost;
  const profitValue = profitBase * profitPercent;

  const totalLabor = baseRegCost + overtimeCost + payrollCost;
  const totalExpenses = avgExpenseCost + additionalCost + perDiemCost;
  const totalCost = totalLabor + totalExpenses + profitValue;

  // Start expanded by default
  const [labCollapsed, setLabCollapsed] = useState(false);
  const [expCollapsed, setExpCollapsed] = useState(false);

  return (
    <div className="bg-gray-900 text-white p-4 rounded space-y-6">
      <div className="text-lg font-semibold">Cost Estimate</div>

      {/* Labor Section */}
      <div>
        <button
          onClick={() => setLabCollapsed(!labCollapsed)}
          className="w-full flex items-center bg-gray-800 p-3 rounded"
        >
          <span>Total Labor Cost:</span>
          <span className="ml-auto">${totalLabor.toFixed(2)}</span>
        </button>
        {!labCollapsed && (
          <div className="mt-3 ml-8 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Base Labor Cost</span><span>${baseRegCost.toFixed(2)}</span>
            </div>
            {overtimeCost > 0 && (
              <div className="flex justify-between">
                <span>Overtime Cost</span><span>${overtimeCost.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Payroll Cost ({(payrollBurden*100).toFixed(1)}%)</span><span>${payrollCost.toFixed(2)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Expenses Section */}
      <div>
        <button
          onClick={() => setExpCollapsed(!expCollapsed)}
          className="w-full flex items-center bg-gray-800 p-3 rounded"
        >
          <span>Total Expenses:</span>
          <span className="ml-auto">${totalExpenses.toFixed(2)}</span>
        </button>
        {!expCollapsed && (
          <div className="mt-3 ml-8 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Average Expense ({(avgExpense*100).toFixed(1)}%)</span><span>${avgExpenseCost.toFixed(2)}</span>
            </div>
            {additionalCost > 0 && (
              <div className="flex justify-between">
                <span>Additional Expenses</span><span>${additionalCost.toFixed(2)}</span>
              </div>
            )}
            {perDiemCost > 0 && (
              <div className="flex justify-between">
                <span>Per Diem</span><span>${perDiemCost.toFixed(2)}</span>
              </div>
            )}
          </div>
        )}
      </div>

      <hr className="border-gray-700" />

      {/* Profit */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <label>Profit %:</label>
          <input
            type="number"
            value={profitPercent*100}
            onChange={e => setProfitPercent(Number(e.target.value)/100)}
            className="w-16 text-black rounded px-1"
          />
        </div>
        <span>Profit $: ${profitValue.toFixed(2)}</span>
      </div>

      <hr className="border-gray-700" />

      {/* Total */}
      <div className="flex justify-between text-xl font-bold">
        <span>Total Estimated Cost:</span>
        <span>${totalCost.toFixed(2)}</span>
      </div>
    </div>
  );
}
