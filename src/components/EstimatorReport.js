import React, { useMemo, useState } from 'react';

export default function EstimatorReport({
  entries, employees, expenseItems,
  perDiemEnabled, perDiemDays,
  payrollBurden, avgExpense,
  profitPercent
}) {
  const [open, setOpen] = useState(true);

  const computed = useMemo(() => {
    let cum = 0;
    return entries.map(e => {
      const dur = Number(e.duration);
      const start = cum, end = start + dur;
      const ot1 = Math.max(0, Math.min(end,12) - Math.max(start,8));
      const ot2 = Math.max(0, end - Math.max(start,12));
      cum = end;
      return { ...e, dur, ot1, ot2 };
    });
  }, [entries]);

  const totals = computed.reduce((acc, e) => {
    const reg = e.dur - e.ot1 - e.ot2;
    acc.reg += reg; acc.ot1 += e.ot1; acc.ot2 += e.ot2;
    return acc;
  }, { reg: 0, ot1: 0, ot2: 0 });

  const baseLabor = employees.reduce((sum, emp) => sum + emp.rate * totals.reg, 0);
  const otLabor = employees.reduce((sum, emp) => sum + emp.rate * (totals.ot1*1.5 + totals.ot2*2), 0);
  const payrollCost = (baseLabor + otLabor) * payrollBurden;
  const laborCost = baseLabor + otLabor + payrollCost;

  const avgExpCost = laborCost * avgExpense;
  const perDiemCost = perDiemEnabled ? employees.length * perDiemDays * 50 : 0;
  const otherExp = expenseItems.reduce((sum, it) => sum + it.cost, 0);

  const expTotal = avgExpCost + perDiemCost + otherExp;
  const flaggedExp = expenseItems.filter(it => it.profitable).reduce((sum, it) => sum + it.cost, 0);
  const profitBase = laborCost + avgExpCost + flaggedExp;
  const revenue = profitBase / (1 - profitPercent);
  const profitVal = revenue - profitBase;

  return (
    <div className="bg-gray-900 text-white rounded-lg shadow p-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Cost Estimate</h3>
        <button onClick={() => setOpen(o => !o)} className="text-white">
          {open ? 'Collapse' : 'Expand'}
        </button>
      </div>
      {open && (
        <div className="space-y-2">
          <div className="flex justify-between bg-gray-800 p-2">
            <span>Labor Cost</span><span>${laborCost.toFixed(2)}</span>
          </div>
          {baseLabor > 0 && <div className="flex justify-between bg-gray-700 p-2 text-sm"><span>Base Rate</span><span>${baseLabor.toFixed(2)}</span></div>}
          {otLabor > 0 && <div className="flex justify-between bg-gray-700 p-2 text-sm"><span>Overtime</span><span>${otLabor.toFixed(2)}</span></div>}
          {payrollCost > 0 && <div className="flex justify-between bg-gray-700 p-2 text-sm"><span>Payroll Burden ({(payrollBurden*100).toFixed(1)}%)</span><span>${payrollCost.toFixed(2)}</span></div>}

          <div className="flex justify-between bg-gray-800 p-2"><span>Expenses</span><span>${expTotal.toFixed(2)}</span></div>
          {avgExpCost > 0 && <div className="flex justify-between bg-gray-700 p-2 text-sm"><span>Avg Expense ({(avgExpense*100).toFixed(1)}%)</span><span>${avgExpCost.toFixed(2)}</span></div>}
          {perDiemCost > 0 && <div className="flex justify-between bg-gray-700 p-2 text-sm"><span>Per Diem</span><span>${perDiemCost.toFixed(2)}</span></div>}
          {otherExp > 0 && <div className="flex justify-between bg-gray-700 p-2 text-sm"><span>Other</span><span>${otherExp.toFixed(2)}</span></div>}

          <div className="flex justify-between bg-gray-800 p-2"><span>Profit ({(profitPercent*100).toFixed(0)}%)</span><span>${profitVal.toFixed(2)}</span></div>
          <div className="flex justify-between bg-gray-800 p-2 font-semibold"><span>Total Estimated Cost</span><span>${revenue.toFixed(2)}</span></div>
        </div>
      )}
    </div>
  );
}
