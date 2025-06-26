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
  const peopleCount = employees.length;

  // Labor calculations
  let cumulative = 0;
  let totalReg = 0, totalOt1 = 0, totalOt2 = 0;
  entries.forEach(e => {
    const dur = e.duration;
    let rem = dur;
    const reg = Math.min(rem, Math.max(0, 8 - cumulative));
    rem -= reg;
    const ot1 = Math.min(rem, Math.max(0, 12 - (cumulative + reg)));
    rem -= ot1;
    const ot2 = rem;
    cumulative += dur;
    totalReg += reg;
    totalOt1 += ot1;
    totalOt2 += ot2;
  });

  // Total labor cost including overtime
  const laborCost = employees.reduce((sum, emp) => {
    return sum
      + (totalReg * emp.rate)
      + (totalOt1 * emp.rate * 1.5)
      + (totalOt2 * emp.rate * 2);
  }, 0);
  const payrollCost = laborCost * payrollBurden;

  // Consolidated overtime cost
  const overtimeCost = employees.reduce((sum, emp) =>
    sum + (totalOt1 * emp.rate * 1.5) + (totalOt2 * emp.rate * 2),
  0);

  // Expense calculations
  const avgExpenseCost = laborCost * avgExpense;
  const perDiemCost = perDiemEnabled ? peopleCount * perDiemDays * 50 : 0;
  const additionalCost = expenseItems.reduce((sum, item) => sum + item.cost, 0);

  // Profit calculation
  const profitExpensesCost = expenseItems
    .filter(item => item.profitable)
    .reduce((sum, item) => sum + item.cost, 0);
  const profitBase = laborCost + avgExpenseCost + profitExpensesCost;
  const profitValue = profitBase * profitPercent;

  const totalCost = laborCost
    + payrollCost
    + avgExpenseCost
    + perDiemCost
    + additionalCost
    + profitValue;

  return (
    <div className="bg-gray-900 text-white p-4 rounded space-y-2">
      <div className="text-lg font-semibold">Cost Estimate</div>
      <div className="flex justify-between">
        <span>Base Labor Cost:</span>
        <span>${laborCost.toFixed(2)}</span>
      </div>
      {overtimeCost > 0 && (
        <div className="flex justify-between">
          <span>Overtime Cost:</span>
          <span>${overtimeCost.toFixed(2)}</span>
        </div>
      )}
      <div className="flex justify-between">
        <span>Payroll Cost ({(payrollBurden * 100).toFixed(1)}%):</span>
        <span>${payrollCost.toFixed(2)}</span>
      </div>
      <hr className="border-gray-700" />
      <div className="flex justify-between">
        <span>Average Expense ({(avgExpense * 100).toFixed(1)}%):</span>
        <span>${avgExpenseCost.toFixed(2)}</span>
      </div>
      {perDiemCost > 0 && (
        <div className="flex justify-between">
          <span>Per Diem:</span>
          <span>${perDiemCost.toFixed(2)}</span>
        </div>
      )}
      {additionalCost > 0 && (
        <div className="flex justify-between">
          <span>Additional Expenses:</span>
          <span>${additionalCost.toFixed(2)}</span>
        </div>
      )}
      <hr className="border-gray-700" />
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
      <hr className="border-gray-700" />
      <div className="flex justify-between text-xl font-bold">
        <span>Total Estimated Cost:</span>
        <span>${totalCost.toFixed(2)}</span>
      </div>
    </div>
  );
}
