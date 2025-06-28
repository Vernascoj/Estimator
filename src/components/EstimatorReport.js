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
  driveRate,
  employeeTypes
}) {
  // Separate employees by type
  const hourlyList = employees.filter(emp => employeeTypes[emp.id] === 'Hourly');
  const salaryList = employees.filter(emp => employeeTypes[emp.id] === 'Salary');

  // Sum of hourly rates
  const empRateSumHourly = hourlyList.reduce((sum, emp) => sum + emp.rate, 0);

  // Calculate hours breakdown
  let cumulative = 0;
  let workReg = 0, workOt1 = 0, workOt2 = 0;
  let driveReg = 0, driveOt1 = 0, driveOt2 = 0;
  entries.forEach(e => {
    const dur = e.duration;
    let rem = dur;
    const reg = Math.min(rem, Math.max(0, 8 - cumulative)); rem -= reg;
    const ot1 = Math.min(rem, Math.max(0, 12 - (cumulative + reg))); rem -= ot1;
    const ot2 = rem;
    cumulative += dur;
    if (e.type === 'Work') {
      workReg += reg; workOt1 += ot1; workOt2 += ot2;
    } else {
      driveReg += reg; driveOt1 += ot1; driveOt2 += ot2;
    }
  });

  // Salary cost at flat 8 hours
const salaryCost = salaryList.reduce((sum, emp) => sum + emp.rate * 8, 0);

// Base cost = regular work + regular drive
const baseCost = workReg * empRateSumHourly + driveReg * driveRate * hourlyList.length;

// Overtime cost
const otCost =
  workOt1 * empRateSumHourly * 1.5 +
  workOt2 * empRateSumHourly * 2 +
  driveOt1 * driveRate * 1.5 * hourlyList.length +
  driveOt2 * driveRate * 2 * hourlyList.length;

// Per-diem & any extra line-item expenses (unchanged)
// Per-diem & any extra line-item expenses (unchanged)
const perDiemCost = perDiemEnabled ? employees.length * perDiemDays * 50 : 0;
const additionalExpenses = expenseItems.reduce((sum, item) => sum + item.cost, 0);

// === Load base+salary for payroll burden ===
const laborBase = baseCost + salaryCost;
const costWithBurden = laborBase / (1 - payrollBurden);
const payrollCost = costWithBurden * payrollBurden;

// Total Labor before avg expense & profit
const totalLabor = costWithBurden + otCost;

// === Load base total for expense & profit ===
const baseTotal = totalLabor / (1 - (avgExpense + profitPercent));
const avgExpenseCost = baseTotal * avgExpense;
const profitValue = baseTotal * profitPercent;
// === Final cost including extras ===
const finalCost = baseTotal + perDiemCost + additionalExpenses;
// Totals
const totalExpenses = avgExpenseCost + perDiemCost + additionalExpenses;

  const [labCollapsed, setLabCollapsed] = useState(false);
  const [expCollapsed, setExpCollapsed] = useState(false);

  return (
    <div className="bg-gray-900 text-white p-4 rounded space-y-6">
      <h2 className="text-xl font-semibold">Cost Estimate</h2>

      {/* Labor Section */}
      <div>
        <button
          className="w-full flex justify-between items-center bg-gray-800 p-3 rounded"
          onClick={() => setLabCollapsed(!labCollapsed)}
        >
          <span>Total Labor</span>
          <span>${totalLabor.toFixed(2)}</span>
        </button>
        {!labCollapsed && (
          <div className="mt-2 ml-4 space-y-1 text-sm">
            {/* Base Rate combining regular & drive */}
            {baseCost > 0 && (
            <div className="flex justify-between">
              <span>Base (Regular + Drive)</span>
              <span>${baseCost.toFixed(2)}</span>
            </div>
          )}
            {/* Show Overtime only if any */}
            {otCost > 0 && (
              <div className="flex justify-between">
                <span>Overtime</span>
                <span>${otCost.toFixed(2)}</span>
              </div>
            )}
            {/* Show Salary only if any */}
            {salaryCost > 0 && (
              <div className="flex justify-between text-blue-300">
                <span>Salary Flat</span>
                <span>${salaryCost.toFixed(2)}</span>
              </div>
            )}
            {/* Payroll Burden */}
            <div className="flex justify-between">
              <span>Payroll Burden ({(payrollBurden * 100).toFixed(1)}%)</span>
              <span>${payrollCost.toFixed(2)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Expenses Section */}
      <div>
        <button
          className="w-full flex justify-between items-center bg-gray-800 p-3 rounded"
          onClick={() => setExpCollapsed(!expCollapsed)}
        >
          <span>Total Expenses</span>
          <span>${totalExpenses.toFixed(2)}</span>
        </button>
        {!expCollapsed && (
          <div className="mt-2 ml-4 space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Avg Expense ({(avgExpense * 100).toFixed(1)}%)</span>
              <span>${avgExpenseCost.toFixed(2)}</span>
            </div>
            {perDiemCost > 0 && (
              <div className="flex justify-between">
                <span>Per Diem</span>
                <span>${perDiemCost.toFixed(2)}</span>
              </div>
            )}
            {additionalExpenses > 0 && (
              <div className="flex justify-between">
                <span>Other Expenses</span>
                <span>${additionalExpenses.toFixed(2)}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Profit & Total */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <label>Profit %:</label>
          <input
            type="number"
            className="w-16 text-black rounded px-1"
            value={profitPercent * 100}
            onChange={e => setProfitPercent(Number(e.target.value) / 100)}
          />
        </div>
        <span>Profit $: ${profitValue.toFixed(2)}</span>
      </div>
      <hr className="border-gray-700" />
      <div className="flex justify-between text-2xl font-bold">
        <span>Total Cost:</span>
        <span>${finalCost.toFixed(2)}</span>
      </div>
    </div>
  );
}
