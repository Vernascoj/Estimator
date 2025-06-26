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
  setProfitPercent,
  driveRate
}) {
  const peopleCount = employees.length;

  // Unified cumulative hours for OT thresholds
  let cumulative = 0;
  let workReg = 0, workOt1 = 0, workOt2 = 0;
  let driveReg = 0, driveOt1 = 0, driveOt2 = 0;

  entries.forEach(e => {
    const dur = e.duration;
    let rem = dur;
    // regular
    const reg = Math.min(rem, Math.max(0, 8 - cumulative));
    rem -= reg;
    // OT1
    const ot1 = Math.min(rem, Math.max(0, 12 - (cumulative + reg)));
    rem -= ot1;
    // OT2
    const ot2 = rem;
    // assign to work or drive
    if (e.type === 'Work') {
      workReg += reg;
      workOt1 += ot1;
      workOt2 += ot2;
    } else {
      driveReg += reg;
      driveOt1 += ot1;
      driveOt2 += ot2;
    }
    // update total cumulative
    cumulative += dur;
  });

  // Base labor cost: sum of regular hours
  const baseRegCost = employees.reduce(
    (sum, emp) => sum + workReg * emp.rate, 0
  ) + driveReg * driveRate;

  // Overtime cost: sum of all overtime hours
  const overtimeCost = employees.reduce(
    (sum, emp) =>
      sum +
      workOt1 * emp.rate * 1.5 +
      workOt2 * emp.rate * 2, 0
  ) + driveOt1 * driveRate * 1.5 + driveOt2 * driveRate * 2;

  // Payroll burden on both base and overtime
  const payrollCost = (baseRegCost + overtimeCost) * payrollBurden;

  // Expenses
  const avgExpenseCost = (baseRegCost + overtimeCost) * avgExpense;
  const perDiemCost = perDiemEnabled ? peopleCount * perDiemDays * 50 : 0;
  const additionalCost = expenseItems.reduce((sum, item) => sum + item.cost, 0);
  const profitExpensesCost = expenseItems
    .filter(item => item.profitable)
    .reduce((sum, item) => sum + item.cost, 0);

  // Profit on avg and profit-flagged expenses
  const profitBase = baseRegCost + overtimeCost + avgExpenseCost + profitExpensesCost;
  const profitValue = profitBase * profitPercent;

  const totalCost = baseRegCost + overtimeCost + payrollCost
    + avgExpenseCost + perDiemCost + additionalCost + profitValue;

  return (
    <div className="bg-gray-900 text-white p-4 rounded space-y-2">
      <div className="text-lg font-semibold">Cost Estimate</div>
      <div className="flex justify-between">
        <span>Base Labor Cost:</span><span>${baseRegCost.toFixed(2)}</span>
      </div>
      {overtimeCost > 0 && (
        <div className="flex justify-between">
          <span>Overtime Cost:</span><span>${overtimeCost.toFixed(2)}</span>
        </div>
      )}
      <div className="flex justify-between">
        <span>Payroll Cost ({(payrollBurden * 100).toFixed(1)}%):</span><span>${payrollCost.toFixed(2)}</span>
      </div>
      <hr className="border-gray-700"/>
      <div className="flex justify-between">
        <span>Average Expense ({(avgExpense * 100).toFixed(1)}%):</span><span>${avgExpenseCost.toFixed(2)}</span>
      </div>
      {perDiemCost > 0 && (
        <div className="flex justify-between">
          <span>Per Diem:</span><span>${perDiemCost.toFixed(2)}</span>
        </div>
      )}
      {additionalCost > 0 && (
        <div className="flex justify-between">
          <span>Additional Expenses:</span><span>${additionalCost.toFixed(2)}</span>
        </div>
      )}
      <hr className="border-gray-700"/>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <label>Profit %:</label>
          <input
            type="number"
            value={profitPercent * 100}
            onChange={e => setProfitPercent(Number(e.target.value) / 100)}
            className="w-16 text-black rounded px-1"
          />
        </div>
        <span>Profit $: ${profitValue.toFixed(2)}</span>
      </div>
      <hr className="border-gray-700"/>
      <div className="flex justify-between text-xl font-bold">
        <span>Total Estimated Cost:</span><span>${totalCost.toFixed(2)}</span>
      </div>
    </div>
  );
}
