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
  // Hours breakdown
  let cumulative = 0, workReg = 0, workOt1 = 0, workOt2 = 0;
  let driveReg = 0, driveOt1 = 0, driveOt2 = 0;
  entries.forEach(e => {
    if (!overtimeEnabled) {
      if (e.type === 'Work') workReg += e.duration;
      else driveReg += e.duration;
      return;
    }
    let rem = e.duration;
    const reg = Math.min(rem, Math.max(0, 8 - cumulative)); rem -= reg;
    const ot1 = Math.min(rem, Math.max(0, 12 - (cumulative + reg))); rem -= ot1;
    const ot2 = rem;
    cumulative += e.duration;
    if (e.type === 'Work') { workReg += reg; workOt1 += ot1; workOt2 += ot2; }
    else { driveReg += reg; driveOt1 += ot1; driveOt2 += ot2; }
  });

  // Salary & hourly
  const salaryCost = employees.filter(emp => employeeTypes[emp.id] === 'Salary')
    .reduce((sum, emp) => sum + emp.rate * 8, 0);
  const hourlyRateSum = employees.filter(emp => employeeTypes[emp.id] === 'Hourly')
    .reduce((sum, emp) => sum + emp.rate, 0);

  // Base & overtime cost
  const baseCost = workReg * hourlyRateSum + driveReg * driveRate * hourlyRateSum;
  const otCost =
    workOt1 * hourlyRateSum * 1.5 +
    workOt2 * hourlyRateSum * 2 +
    driveOt1 * driveRate * 1.5 * hourlyRateSum +
    driveOt2 * driveRate * 2 * hourlyRateSum;

  // Local expense state with enabled flags
  const [localItems, setLocalItems] = useState(() =>
    expenseItems.map(item => ({ ...item, enabled: true }))
  );

  // Sync incoming expenseItems: preserve existing enabled flags, add new ones
  useEffect(() => {
    setLocalItems(current => {
      return expenseItems.map((item, idx) => {
        const existing = current[idx];
        return {
          enabled: existing ? existing.enabled : true,
          description: item.description || (existing && existing.description) || 'Additional Expense',
          cost: item.cost !== undefined ? item.cost : (existing && existing.cost) || 0
        };
      });
    });
  }, [expenseItems]);

  const toggleItem = idx => {
    setLocalItems(items =>
      items.map((it, i) =>
        i === idx ? { ...it, enabled: !it.enabled } : it
      )
    );
  };

  // Compute expenses
  const additionalRawCost = localItems.reduce((sum, it) => sum + (it.enabled ? it.cost : 0), 0);
  const uncheckedCost = localItems.reduce((sum, it) => sum + (!it.enabled ? it.cost : 0), 0);

  // Per-diem cost
  const perDiemCost = perDiemEnabled ? employees.length * perDiemDays * 50 : 0;

  // Labor after burden
  const laborBase = baseCost + salaryCost;
  const laborMarkupBase = laborBase / (1 - payrollBurden);
  const totalLabor = laborMarkupBase + otCost;

  // Base totals
  const baseTotal = totalLabor / (1 - (avgExpense + profitPercent + administrationPercent));
  const avgExpenseCost = baseTotal * avgExpense;
  const adminCost = baseTotal * administrationPercent;
  const baseProfit = baseTotal * profitPercent;

  // Additional profit
  const additionalProfit = additionalRawCost * profitPercent;
  const totalProfit = baseProfit + additionalProfit;

  // Final totals
  const finalCost =
    baseTotal + perDiemCost + uncheckedCost + additionalRawCost * (1 + profitPercent);
  const totalExpenses =
    avgExpenseCost + perDiemCost + adminCost + uncheckedCost + additionalRawCost;

  // UI state for expand/collapse
  const [labOpen, setLabOpen] = useState(false);
  const [expOpen, setExpOpen] = useState(false);
  const reportRef = useRef();

  // PDF export
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
        <button onClick={savePdf} title="Save PDF" className="p-2 rounded hover:bg-gray-800">
          <Save className="h-6 w-6 text-white" />
        </button>
      </div>

      {/* Labor */}
      <div>
        <button onClick={() => setLabOpen(!labOpen)} className="w-full flex justify-between bg-gray-800 p-3 rounded">
          <span>{labOpen ? '+ Total Labor' : '- Total Labor'}</span>
          <span>${totalLabor.toFixed(2)}</span>
        </button>
        {labOpen && (
          <div className="mt-2 ml-4 text-sm space-y-1">
            <div className="flex justify-between"><span>Base</span><span>${baseCost.toFixed(2)}</span></div>
            {otCost > 0 && <div className="flex justify-between"><span>Overtime</span><span>${otCost.toFixed(2)}</span></div>}
            {salaryCost > 0 && <div className="flex justify-between text-blue-300"><span>Salary</span><span>${salaryCost.toFixed(2)}</span></div>}
            <div className="flex justify-between"><span>Burden ({(payrollBurden*100).toFixed(1)}%)</span><span>${(laborMarkupBase*payrollBurden).toFixed(2)}</span></div>
          </div>
        )}
      </div>

      {/* Expenses */}
      <div>
        <button onClick={() => setExpOpen(!expOpen)} className="w-full flex justify-between bg-gray-800 p-3 rounded">
          <span>{expOpen ? '+ Total Expenses' : '- Total Expenses'}</span>
          <span>${totalExpenses.toFixed(2)}</span>
        </button>
        {expOpen && (
          <div className="mt-2 ml-4 text-sm space-y-1">
            {/* Avg Expense */}
            <div className="flex justify-between"><span>Avg Expense ({(avgExpense*100).toFixed(1)}%)</span><span>${avgExpenseCost.toFixed(2)}</span></div>
            {/* Per Diem */}
            {perDiemCost > 0 && <div className="flex justify-between"><span>Per Diem</span><span>${perDiemCost.toFixed(2)}</span></div>}
            {/* Administration */}
            <div className="flex justify-between"><span>Administration ({(administrationPercent*100).toFixed(1)}%)</span><span>${adminCost.toFixed(2)}</span></div>
            {/* Individual Additional Expenses */}
            {localItems.map((item, i) => (
              <div key={i} className="flex justify-between items-center">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={item.enabled}
                    onChange={() => toggleItem(i)}
                  />
                  <span>{item.description || 'Additional Expense'}</span>
                </label>
                <span>${item.cost.toFixed(2)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Profit & Total */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2"><label>Profit:</label><input type="number" onFocus={e => e.target.select()} defaultValue={(profitPercent*100).toFixed(1)} onBlur={e => setProfitPercent(Number(e.target.value)/100)} className="w-16 text-black rounded px-1"/></div>
        <div className="flex flex-col items-end"><span>${totalProfit.toFixed(2)}</span>{additionalProfit>0 && <span className="text-sm text-gray-400">(+${additionalProfit.toFixed(2)})</span>}</div>
      </div>

      <hr className="border-gray-700"/>

      {/* Final Total */}
      <div className="flex justify-between text-2xl font-bold"><span>Total Cost:</span><span>${finalCost.toFixed(2)}</span></div>
    </div>
  );
}