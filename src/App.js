import React, { useState, useMemo, useEffect } from 'react';
import GroupSelector from './components/GroupSelector';
import EmployeeTable from './components/EmployeeTable';
import ManageEmployeesModal from './components/ManageEmployeesModal';
import HoursWorked from './components/HoursWorked';
import HoursSummary from './components/HoursSummary';
import Expenses from './components/Expenses';
import EstimatorReport from './components/EstimatorReport';
import employeesData from './data/employeesData';

export default function App() {
  const [selectedGroup, setSelectedGroup] = useState('ATKINS');
  const [entries, setEntries] = useState([{ id: Date.now().toString(), type: 'Work', duration: 8 }]);
  const [expenseItems, setExpenseItems] = useState([]);
  const [perDiemEnabled, setPerDiemEnabled] = useState(false);
  const [perDiemDays, setPerDiemDays] = useState(1);
  const [payrollBurden, setPayrollBurden] = useState(0.092);
  const [avgExpense, setAvgExpense] = useState(0.12);
  const [profitPercent, setProfitPercent] = useState(0.30);

  const employeesInGroup = useMemo(() => employeesData.filter(emp => emp.group === selectedGroup), [selectedGroup]);
  const [includedMap, setIncludedMap] = useState({});
  useEffect(() => {
    const map = {};
    employeesInGroup.forEach(emp => { map[emp.id] = true; });
    setIncludedMap(map);
  }, [employeesInGroup]);

  const toggleInclude = id => setIncludedMap(prev => ({ ...prev, [id]: !prev[id] }));
  const selectedEmployees = useMemo(
    () => employeesInGroup.filter(emp => includedMap[emp.id]),
    [employeesInGroup, includedMap]
  );

  const [manageOpen, setManageOpen] = useState(false);
  const handleManage = (empId) => setManageOpen(true);
  const closeManage = () => setManageOpen(false);

  const addEntry = () => setEntries(prev => [...prev, { id: Date.now().toString(), type: 'Work', duration: 0 }]);
  const deleteEntry = id => setEntries(prev => prev.filter(e => e.id !== id));
  const updateEntry = (id, changes) => setEntries(prev => prev.map(e => e.id === id ? { ...e, ...changes } : e));

  const addExpense = () => setExpenseItems(prev => [...prev, { id: Date.now().toString(), description: '', cost: 0, profitable: false }]);
  const updateExpense = (id, changes) => setExpenseItems(prev => prev.map(item => item.id === id ? { ...item, ...changes } : item));
  const deleteExpense = id => setExpenseItems(prev => prev.filter(item => item.id !== id));

  return (
    <div className="p-4 dark:bg-gray-800 min-h-screen">
      <div className="max-w-3xl mx-auto space-y-6">
        <GroupSelector value={selectedGroup} onChange={setSelectedGroup} />
        <EmployeeTable
          employees={selectedEmployees}
          onManage={handleManage}
          onDelete={toggleInclude}
        />
        {manageOpen && (
          <ManageEmployeesModal
            employees={employeesInGroup}
            includedMap={includedMap}
            onToggleInclude={toggleInclude}
            onClose={closeManage}
          />
        )}

        <div>
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold text-white">Hours Worked</h2>
            <button onClick={addEntry} className="px-3 py-1 bg-indigo-500 text-white rounded">Add Entry</button>
          </div>
          <HoursWorked
            entries={entries}
            onDelete={deleteEntry}
            onUpdateEntry={updateEntry}
            overtimeEnabled
          />
          <HoursSummary entries={entries} />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold text-white">Expenses</h2>
            <button onClick={addExpense} className="px-3 py-1 bg-indigo-500 text-white rounded">Add Expense</button>
          </div>
          <Expenses expenseItems={expenseItems} onUpdateExpense={updateExpense} onDeleteExpense={deleteExpense} />
        </div>

        <EstimatorReport
          entries={entries}
          employees={selectedEmployees}
          expenseItems={expenseItems}
          perDiemEnabled={perDiemEnabled}
          perDiemDays={perDiemDays}
          payrollBurden={payrollBurden}
          avgExpense={avgExpense}
          profitPercent={profitPercent}
          setProfitPercent={setProfitPercent}
        />
      </div>
    </div>
  );
}
