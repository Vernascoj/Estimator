import React, { useMemo, useState } from 'react';

export default function EstimatorReport({
  entries, employees, expenseItems,
  perDiemEnabled, perDiemDays,
  payrollBurden, avgExpense,
  driveRate, profitPercent
}) {
  const computed = useMemo(() => {
    let cum = 0;
    return entries.map(entry => {
      const dur = Number(entry.duration);
      const start = cum;
      const end = start + dur;
      const ot1 = Math.max(0, Math.min(end, 12) - Math.max(start, 8));
      const ot2 = Math.max(0, end - Math.max(start, 12));
      cum = end;
      return { ...entry, dur, ot1, ot2 };
    });
  }, [entries]);

  const totals = computed.reduce((acc, e) => {
    const key = e.type.toLowerCase();
    const reg = e.dur - e.ot1 - e.ot2;
    acc[`${key}Reg`] = (acc[`${key}Reg`] || 0) + reg;
    acc[`${key}Ot1`] = (acc[`${key}Ot1`] || 0) + e.ot1;
    acc[`${key}Ot2`] = (acc[`${key}Ot2`] || 0) + e.ot2;
    return acc;
  }, { workReg: 0, workOt1: 0, workOt2: 0, driveReg: 0 });

  const totalWorkReg = totals.workReg;
  const totalWorkOt = totals.workOt1 + totals.workOt2;
  const totalDrive = totals.driveReg;

  const baseLaborCost = employees.reduce((sum, emp) => sum + emp.rate * totalWorkReg, 0);
  const otLaborCost = employees.reduce((sum, emp) => sum + emp.rate * (totals.workOt1 * 1.5 + totals.workOt2 * 2), 0);
  const payrollCost = baseLaborCost * payrollBurden;
  const laborCost = baseLaborCost + otLaborCost + payrollCost;

  const driveCost = totalDrive * driveRate;

  const avgExpenseCost = laborCost * avgExpense;
  const perDiemCost = perDiemEnabled ? employees.length * perDiemDays * 50 : 0;
  const otherExpenses = expenseItems.reduce((sum, it) => sum + it.cost, 0);

  const expensesTotal = avgExpenseCost + perDiemCost + otherExpenses;
  const revenue = (laborCost + driveCost + expensesTotal) / (1 - profitPercent);
  const profitValue = revenue - (laborCost + driveCost + expensesTotal);

  const [open, setOpen] = useState(false);

  return (
    <div className="bg-gray-900 rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-white">Cost Estimate</h3>
        <button onClick={() => setOpen(o => !o)} className="text-white">
          {open ? 'Collapse' : 'Expand'}
        </button>
      </div>
      {open && (
        <div className="text-white">
          {/* Labor */}
          <div className="flex justify-between border-b border-gray-600 py-2">
            <span>Labor</span>
            <span>${laborCost.toFixed(2)}</span>
          </div>
          {baseLaborCost > 0 && (
            <div className="flex justify-between pl-4 border-b border-gray-600 py-1 text-sm">
              <span>Base Rate</span>
              <span>${baseLaborCost.toFixed(2)}</span>
            </div>
          )}
          {otLaborCost > 0 && (
            <div className="flex justify-between pl-4 border-b border-gray-600 py-1 text-sm">
              <span>Overtime</span>
              <span>${otLaborCost.toFixed(2)}</span>
            </div>
          )}
          {payrollCost > 0 && (
            <div className="flex justify-between pl-4 border-b border-gray-600 py-1 text-sm">
              <span>Payroll Burden ({(payrollBurden*100).toFixed(1)}%)</span>
              <span>${payrollCost.toFixed(2)}</span>
            </div>
          )}

          {/* Drive */}
          {driveCost > 0 && (
            <div className="flex justify-between border-b border-gray-600 py-2">
              <span>Drive Time</span>
              <span>${driveCost.toFixed(2)}</span>
            </div>
          )}

          {/* Expenses */}
          <div className="flex justify-between border-b border-gray-600 py-2">
            <span>Expenses</span>
            <span>${expensesTotal.toFixed(2)}</span>
          </div>
          {avgExpenseCost > 0 && (
            <div className="flex justify-between pl-4 border-b border-gray-600 py-1 text-sm">
              <span>Avg Expense ({(avgExpense*100).toFixed(1)}%)</span>
              <span>${avgExpenseCost.toFixed(2)}</span>
            </div>
          )}
          {perDiemCost > 0 && (
            <div className="flex justify-between pl-4 border-b border-gray-600 py-1 text-sm">
              <span>Per Diem</span>
              <span>${perDiemCost.toFixed(2)}</span>
            </div>
          )}
          {otherExpenses > 0 && (
            <div className="flex justify-between pl-4 border-b border-gray-600 py-1 text-sm">
              <span>Other</span>
              <span>${otherExpenses.toFixed(2)}</span>
            </div>
          )}

          {/* Profit */}
          <div className="flex justify-between border-b border-gray-600 py-2">
            <span>Profit ({(profitPercent*100).toFixed(0)}%)</span>
            <span>${profitValue.toFixed(2)}</span>
          </div>

          {/* Total */}
          <div className="flex justify-between pt-2">
            <span className="font-semibold">Total Estimated Cost</span>
            <span className="font-semibold">${revenue.toFixed(2)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
