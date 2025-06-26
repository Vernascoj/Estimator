import React, { useState, useMemo, useEffect } from 'react';
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
  const [payrollBurden, setPayrollBurden] = useState(9.2);
  const [expensePercent, setExpensePercent] = useState(12);
  const [driveTime, setDriveTime] = useState(17.5);
  const [darkMode, setDarkMode] = useState(false);
  // Start with one hour entry defaulted at 8 hours
  const [entries, setEntries] = useState(() => [{
    id: Date.now().toString(),
    type: 'Work',
    duration: 8
  }]);
  const [overtimeEnabled, setOvertimeEnabled] = useState(true);

  // Expenses state
  const [perDiemEnabled, setPerDiemEnabled] = useState(false);
  const [perDiemDays, setPerDiemDays] = useState(1);
  const [expenseItems, setExpenseItems] = useState([]);

  const [employees] = useState(employeesData);
  const groups = useMemo(() => Array.from(new Set(employees.map(emp => emp.group))), [employees]);
  const employeesInGroup = useMemo(() => employees.filter(emp => emp.group === selectedGroup), [employees, selectedGroup]);

  const [includedMap, setIncludedMap] = useState({});
  useEffect(() => {
    const newMap = employeesInGroup.reduce((map, emp) => ({ ...map, [emp.id]: true }), {});
    setIncludedMap(newMap);
  }, [employeesInGroup]);

  const toggleInclude = id => setIncludedMap(prev => ({ ...prev, [id]: !prev[id] }));
  const selectedEmployees = useMemo(
    () => employeesInGroup.filter(emp => includedMap[emp.id]), 
    [employeesInGroup, includedMap]
  );

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const addEntry = () => {
    const id = Date.now().toString();
    setEntries(prev => [...prev, { id, type: 'Work', duration: 0 }]);
  };
  const deleteEntry = id => setEntries(prev => prev.filter(e => e.id !== id));
  const reorderEntries = newList => setEntries(newList);

  // Expense handlers
  const addExpense = () => {
    const id = Date.now().toString();
    setExpenseItems(prev => [...prev, { id, description: '', cost: 0, profitable: false }]);
  };
  const updateExpense = (id, changes) => {
    setExpenseItems(prev => prev.map(item => item.id === id ? { ...item, ...changes } : item));
  };
  const deleteExpense = id => setExpenseItems(prev => prev.filter(item => item.id !== id));
  const reorderExpenses = newList => setExpenseItems(newList);

  return (
    <div className="p-4 dark:bg-gray-800 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Group & Settings */}
        <div className="flex justify-between items-center">
          <GroupSelector value={selectedGroup} onChange={setSelectedGroup} />
          <button onClick={() => setSettingsOpen(true)} className="px-4 py-2 bg-blue-500 text-white rounded">
            Settings
          </button>
        </div>
        {settingsOpen && (
          <SettingsModal
            onClose={() => setSettingsOpen(false)}
            payrollBurden={payrollBurden}
            setPayrollBurden={setPayrollBurden}
            expensePercent={expensePercent}
            setExpensePercent={setExpensePercent}
            driveTime={driveTime}
            setDriveTime={setDriveTime}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
          />
        )}
        {/* Employees */}
        <EmployeeTable
          employees={selectedEmployees}
          onDelete={toggleInclude}
          onManage={() => setSelectorOpen(true)}
        />
        {selectorOpen && (
          <ManageEmployeesModal
            onClose={() => setSelectorOpen(false)}
            employees={employeesInGroup}
            includedMap={includedMap}
            onToggleInclude={toggleInclude}
          />
        )}
        {/* Hours Worked */}
        <HoursWorked
          entries={entries}
          onAdd={addEntry}
          onDelete={deleteEntry}
          onReorder={reorderEntries}
          overtimeEnabled={overtimeEnabled}
          setOvertimeEnabled={setOvertimeEnabled}
        />
        {/* Expenses */}
        <Expenses
          personCount={selectedEmployees.length}
          perDiemEnabled={perDiemEnabled}
          perDiemDays={perDiemDays}
          setPerDiemEnabled={setPerDiemEnabled}
          setPerDiemDays={setPerDiemDays}
          expenseItems={expenseItems}
          onAddExpense={addExpense}
          onUpdateExpense={updateExpense}
          onDeleteExpense={deleteExpense}
          onReorderExpenses={reorderExpenses}
        />
        {/* Report */}
        <EstimatorReport />
      </div>
    </div>
);
}
