import React, { useState, useEffect, useMemo } from 'react';
import GroupSelector from './components/GroupSelector';
import SettingsModal from './components/SettingsModal';
import ManageEmployeesModal from './components/ManageEmployeesModal';
import HoursWorked from './components/HoursWorked';
import EmployeeTable from './components/EmployeeTable';
import Expenses from './components/Expenses';
import EstimatorReport from './components/EstimatorReport';

function App() {
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState('ATKINS');
  const [payrollBurden, setPayrollBurden] = useState(9.2);
  const [expensePercent, setExpensePercent] = useState(12);
  const [driveTime, setDriveTime] = useState(17.5);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  const [employees, setEmployees] = useState([
    { id: '1', firstName: 'Randy', lastName: 'Batchelor', rate: 25.5, group: 'ATKINS' },
    { id: '2', firstName: 'Victor', lastName: 'Dominguez', rate: 26.5, group: 'ATKINS' },
    { id: '3', firstName: 'Alice',  lastName: 'Johnson',   rate: 28.0, group: 'NORCAL' },
    { id: '4', firstName: 'Bob',    lastName: 'Smith',     rate: 27.0, group: 'NORCAL' },
  ]);
  const [includedMap, setIncludedMap] = useState({});
  const [employeesInGroup, setEmployeesInGroup] = useState([]);

  useEffect(() => {
    const filtered = employees.filter(emp => emp.group === selectedGroup);
    setEmployeesInGroup(filtered);
    const newMap = filtered.reduce((map, emp) => ({ ...map, [emp.id]: true }), {});
    setIncludedMap(newMap);
  }, [selectedGroup, employees]);


  const toggleInclude = (id) => {
    setIncludedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const selectedEmployees = useMemo(() => employeesInGroup.filter(emp => includedMap[emp.id]), [employeesInGroup, includedMap]);

  return (
    <div className="p-4 dark:bg-gray-800 min-h-screen">
  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="flex justify-between items-center mb-4">
        <GroupSelector value={selectedGroup} onChange={setSelectedGroup} />
        <button
          onClick={() => setSettingsOpen(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
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

      <EmployeeTable
        employees={selectedEmployees}
        onDelete={toggleInclude}
        onManage={() => setSelectorOpen(true)}
      />

      {selectorOpen && (
        <ManageEmployeesModal
          onClose={() => setSelectorOpen(false)}
          employees={employees.filter(emp => emp.group === selectedGroup)}
          includedMap={includedMap}
          onToggleInclude={toggleInclude}
        />
      )}

      <Expenses />
      <div className="mt-6"><EstimatorReport /></div>
  </div>
      <div className="mt-6"><EstimatorReport /></div>
    </div>
  );
}

export default App;
