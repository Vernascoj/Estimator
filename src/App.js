import React, { useState, useMemo, useEffect } from 'react';
import { Plus } from 'lucide-react';
import GroupSelector from './components/GroupSelector';
import SettingsModal from './components/SettingsModal';
import ManageEmployeesModal from './components/ManageEmployeesModal';
import HoursWorked from './components/HoursWorked';
import EmployeeTable from './components/EmployeeTable';
import Expenses from './components/Expenses';
import EstimatorReport from './components/EstimatorReport';

const employeesData = [
  { id: '1', firstName: 'Randy', lastName: 'Batchelor', rate: 25.5, group: 'ATKINS' },
  { id: '2', firstName: 'Victor', lastName: 'Dominguez', rate: 26.5, group: 'ATKINS' },
  { id: '3', firstName: 'Alice',  lastName: 'Johnson',   rate: 28.0, group: 'NORCAL' },
  { id: '4', firstName: 'Bob',    lastName: 'Smith',     rate: 27.0, group: 'NORCAL' },
];

export default function App() {
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState('ATKINS');
  const [darkMode, setDarkMode] = useState(false);

  // Work entries
  const [entries, setEntries] = useState([{ id: 'initial', type: 'Work', duration: 8 }]);
  const [overtimeEnabled, setOvertimeEnabled] = useState(true);

  // Expenses
  const [expenseItems, setExpenseItems] = useState([]);

  // Per Diem
  const [perDiemEnabled, setPerDiemEnabled] = useState(false);
  const [perDiemDays, setPerDiemDays] = useState(1);

  // Estimate settings
  const [payrollBurden] = useState(0.092);
  const [avgExpense] = useState(0.12);
  const [driveRate] = useState(17.5);
  const [profitPercent] = useState(0.2);

  const [employees] = useState(employeesData);
  const employeesInGroup = useMemo(() =>
    employees.filter(emp => emp.group === selectedGroup),
    [employees, selectedGroup]
  );

  const [includedMap, setIncludedMap] = useState({});
  useEffect(() => {
    const map = {};
    employeesInGroup.forEach(emp => map[emp.id] = true);
    setIncludedMap(map);
  }, [employeesInGroup]);
  const toggleInclude = id => setIncludedMap(prev => ({ ...prev, [id]: !prev[id] }));
  const selectedEmployees = useMemo(
    () => employeesInGroup.filter(emp => includedMap[emp.id]),
    [employeesInGroup, includedMap]
  );

  // Handlers
  const addEntry = () => setEntries(prev => [...prev, { id: Date.now().toString(), type: 'Work', duration: 0 }]);
  const deleteEntry = id => setEntries(prev => prev.filter(e => e.id !== id));
  const reorderEntries = newList => setEntries(newList);
  const addExpense = () => setExpenseItems(prev => [...prev, { id: Date.now().toString(), description: '', cost: 0, profitable: false }]);
  const updateExpense = (id, changes) => setExpenseItems(prev => prev.map(item => item.id === id ? { ...item, ...changes } : item));
  const deleteExpense = id => setExpenseItems(prev => prev.filter(item => item.id !== id));
  const reorderExpenses = newList => setExpenseItems(newList);

  return (
    <div className="p-4 dark:bg-gray-800 min-h-screen">
      {/* Header */}
      <div className="bg-blue-500 text-white p-4 mb-6 max-w-4xl mx-auto rounded-lg">
        <div className="flex justify-between items-center">
          <GroupSelector value={selectedGroup} onChange={setSelectedGroup} />
          <button onClick={() => setSettingsOpen(true)} className="px-4 py-2 bg-blue-700 rounded text-white">
            Settings
          </button>
        </div>
      </div>
      {settingsOpen && <SettingsModal />}

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Employees */}
        <div className="bg-white dark:bg-gray-700 rounded-lg shadow p-4">
          <EmployeeTable
            employees={selectedEmployees}
            onDelete={toggleInclude}
            onManage={() => setSelectorOpen(true)}
          />
          {selectorOpen && <ManageEmployeesModal
            employees={employeesInGroup}
            includedMap={includedMap}
            onToggleInclude={toggleInclude}
            onClose={() => setSelectorOpen(false)}
          />}
        </div>

        {/* Hours Worked */}
        <div className="bg-white dark:bg-gray-700 rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-white">Hours Worked</h3>
            <div className="flex items-center space-x-2">
              <label className="flex items-center space-x-1 text-white">
                <input type="checkbox" checked={overtimeEnabled} onChange={e => setOvertimeEnabled(e.target.checked)} className="h-4 w-4" />
                <span>Overtime</span>
              </label>
              <button onClick={addEntry} className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 flex items-center space-x-1">
                <Plus className="h-4 w-4" /><span>Add Entry</span>
              </button>
            </div>
          </div>
          <HoursWorked entries={entries} onDelete={deleteEntry} onReorder={reorderEntries} overtimeEnabled={overtimeEnabled} />
        </div>

        {/* Expenses */}
        <div className="bg-white dark:bg-gray-700 rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-white">Expenses</h3>
            <button onClick={addExpense} className="px-3 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600 flex items-center space-x-1">
              <Plus className="h-4 w-4" /><span>Add Expense</span>
            </button>
          </div>
          <Expenses
            expenseItems={expenseItems}
            onAddExpense={addExpense}
            onUpdateExpense={updateExpense}
            onDeleteExpense={deleteExpense}
            onReorderExpenses={reorderExpenses}
          />
        </div>

        {/* Cost Estimate */}
        <EstimatorReport
          entries={entries}
          employees={selectedEmployees}
          expenseItems={expenseItems}
          perDiemEnabled={perDiemEnabled}
          perDiemDays={perDiemDays}
          payrollBurden={payrollBurden}
          avgExpense={avgExpense}
          driveRate={driveRate}
          profitPercent={profitPercent}
        />

      </div>
    </div>
  );
}
