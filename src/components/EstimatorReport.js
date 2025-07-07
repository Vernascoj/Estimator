import React, { useState, useRef, useEffect } from 'react';
import { Save } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function EstimatorReport({
  entries,
  employees,
  expenseItems,
  perDiemEnabled,
  perDiemDays,
  payrollBurden,
  avgExpense,
  profitPercent = 0.25,
  setProfitPercent = () => {},
  driveRate,
  employeeTypes,
  overtimeEnabled,
  administrationPercent = 0.05,
}) {
  // Hour breakdown
  let workReg = 0, workOt1 = 0, workOt2 = 0;
  let driveReg = 0, driveOt1 = 0, driveOt2 = 0;
  let cumulative = 0;

  entries.forEach(entry => {
    const dur = entry.duration;
    const prev = cumulative;
    cumulative += dur;

    if (!overtimeEnabled || employeeTypes[entry.employeeId] === 'Salary') {
      if (entry.type === 'Work') workReg += dur;
      else driveReg += dur;
      return;
    }
    if (entry.straightOT) {
      if (entry.type === 'Work') workOt1 += dur;
      else driveOt1 += dur;
      return;
    }
    const regHrs = Math.min(dur, Math.max(0, 8 - prev));
    let rem = dur - regHrs;
    const ot1Hrs = Math.min(rem, 4);
    rem -= ot1Hrs;
    const ot2Hrs = rem;
    if (entry.type === 'Work') {
      workReg += regHrs; workOt1 += ot1Hrs; workOt2 += ot2Hrs;
    } else {
      driveReg += regHrs; driveOt1 += ot1Hrs; driveOt2 += ot2Hrs;
    }
  });

  // Monetary rates
  const salaryCost = employees
    .filter(e => employeeTypes[e.id] === 'Salary')
    .reduce((sum, emp) => sum + emp.rate * 8, 0);
  const hourlySum = employees
    .filter(e => employeeTypes[e.id] === 'Hourly')
    .reduce((sum, emp) => sum + emp.rate, 0);

  // Base and OT costs
  const baseCost = workReg * hourlySum + driveReg * driveRate * employees.length;
  const otCost =
    workOt1 * hourlySum * 1.5 +
    workOt2 * hourlySum * 2 +
    driveOt1 * driveRate * 1.5 * employees.length +
    driveOt2 * driveRate * 2 * employees.length;

  // Apply payroll burden on combined labor
  const rawLaborCost = baseCost + salaryCost + otCost;
  const totalLabor = rawLaborCost / (1 - payrollBurden);
  const burdenCost = totalLabor * payrollBurden;

  // Manage additional expenses
  const [localItems, setLocalItems] = useState(expenseItems.map(i => ({ ...i, enabled: true })));
  useEffect(() => {
    setLocalItems(prev => expenseItems.map((it, i) => ({
      enabled: prev[i]?.enabled ?? true,
      description: it.description || prev[i]?.description || 'Additional Expense',
      cost: it.cost != null ? it.cost : prev[i]?.cost || 0,
    })));
  }, [expenseItems]);
  const toggleItem = idx => setLocalItems(items =>
    items.map((it, i) => i === idx ? { ...it, enabled: !it.enabled } : it)
  );
  const additionalCost = localItems.reduce((s, it) => s + (it.enabled ? it.cost : 0), 0);
  const uncheckedCost = localItems.reduce((s, it) => s + (!it.enabled ? it.cost : 0), 0);
  const perDiemCost = perDiemEnabled ? employees.length * perDiemDays * 50 : 0;

  // Expenses & profit
  const baseTotal = totalLabor / (1 - (avgExpense + profitPercent + administrationPercent));
  const avgExpCost = baseTotal * avgExpense;
  const adminCost = baseTotal * administrationPercent;
  const baseProfit = baseTotal * profitPercent;
  const additionalProfit = additionalCost * profitPercent;
  const totalProfit = baseProfit + additionalProfit;

  const totalExpenses = avgExpCost + perDiemCost + adminCost + uncheckedCost + additionalCost;
  const finalCost = baseTotal + perDiemCost + uncheckedCost + additionalCost * (1 + profitPercent);

  // UI state
  const [labOpen, setLabOpen] = useState(false);
  const [expOpen, setExpOpen] = useState(false);
  const reportRef = useRef();

  const savePdf = async () => {
    if (!reportRef.current) return;
    const canvas = await html2canvas(reportRef.current, { scale: 2 });
    const img = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'pt', 'a4');
    const w = pdf.internal.pageSize.getWidth();
    const h = (canvas.height * w) / canvas.width;
    pdf.addImage(img, 'PNG', 0, 0, w, h);
    pdf.save('Estimate.pdf');
  };

  return (
    <div ref={reportRef} className="bg-gray-900 text-white p-4 rounded space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Cost Estimate</h2>
        <button onClick={savePdf} className="p-2 rounded hover:bg-gray-800" title="Save PDF">
          <Save className="h-6 w-6 text-white" />
        </button>
      </div>

      {/* Labor Section */}
      <div>
        <button onClick={() => setLabOpen(!labOpen)} className="w-full flex justify-between bg-gray-800 p-3 rounded">
          <span>{labOpen ? '-' : '+'} Total Labor</span><span>${totalLabor.toFixed(2)}</span>
        </button>
        {labOpen && (
          <div className="mt-2 ml-4 text-sm space-y-1">
            {baseCost > 0 && (
              <div className="flex justify-between"><span>Base Cost</span><span>${baseCost.toFixed(2)}</span></div>
            )}
            {otCost > 0 && (
              <div className="flex justify-between"><span>Overtime Cost</span><span>${otCost.toFixed(2)}</span></div>
            )}
            {salaryCost > 0 && (
              <div className="flex justify-between text-blue-300"><span>Salary Cost</span><span>${salaryCost.toFixed(2)}</span></div>
            )}
            <div className="flex justify-between"><span>Payroll Burden ({Math.round(payrollBurden * 100)}%)</span><span>${burdenCost.toFixed(2)}</span></div>
          </div>
        )}
      </div>

      {/* Expenses Section */}
      <div>
        <button onClick={() => setExpOpen(!expOpen)} className="w-full flex justify-between bg-gray-800 p-3 rounded">
          <span>{expOpen ? '-' : '+'} Total Expenses</span><span>${totalExpenses.toFixed(2)}</span>
        </button>
        {expOpen && (
          <div className="mt-2 ml-4 text-sm space-y-1">
            <div className="flex justify-between"><span>Avg Expense ({Math.round(avgExpense * 100)}%)</span><span>${avgExpCost.toFixed(2)}</span></div>
            {perDiemCost > 0 && (<div className="flex justify-between"><span>Per Diem</span><span>${perDiemCost.toFixed(2)}</span></div>)}
            <div className="flex justify-between"><span>Administration ({Math.round(administrationPercent * 100)}%)</span><span>${adminCost.toFixed(2)}</span></div>
            {localItems.map((it, idx) => (
              <div key={idx} className="flex justify-between items-center"><label className="flex items-center"><input type="checkbox" className="mr-2" checked={it.enabled} onChange={() => toggleItem(idx)} /><span>{it.description}</span></label><span>${it.cost.toFixed(2)}</span></div>
            ))}
          </div>
        )}
      </div>

      {/* Profit Section */}
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <label className="flex items-center space-x-2">
            <span>Profit (%)</span>
            <input
              type="number"
              min="0"
              max="100"
              step="1"
              value={Math.round(profitPercent * 100)}
              onFocus={e => e.target.select()}
              onChange={e => setProfitPercent(Math.max(0, parseInt(e.target.value, 10)) / 100)}
              className="w-16 text-center text-black p-1 rounded"
            />
          </label>
          <span>${totalProfit.toFixed(2)}</span>
        </div>
        {additionalProfit > 0 && (<div className="flex justify-between text-sm text-gray-400"><span>Additional Profit</span><span>${additionalProfit.toFixed(2)}</span></div>)}
      </div>

      <hr className="border-gray-700"/>

      {/* Final Total */}
      <div className="flex justify-between text-2xl font-bold"><span>Total Cost:</span><span>${finalCost.toFixed(2)}</span></div>
    </div>
  );
}
