import React, { useState, useMemo, useEffect } from 'react';
import GroupSelector from './components/GroupSelector';
import EmployeeTable from './components/EmployeeTable';
import ManageEmployeesModal from './components/ManageEmployeesModal';
import HoursWorked from './components/HoursWorked';
import HoursSummary from './components/HoursSummary';
import PerDiem from './components/PerDiem';
import Expenses from './components/Expenses';
import EstimatorReport from './components/EstimatorReport';
import SettingsModal from './components/SettingsModal';
import employeesData from './data/employeesData';

export default function App() {
  // Default to first group to match your ordering
  const [selectedGroup, setSelectedGroup] = useState('NorCal');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [driveRate, setDriveRate] = useState(17.5);
  // Overtime toggle state
  const [overtimeEnabled, setOvertimeEnabled] = useState(true);
  // Overtime toggle state
  const [entries, setEntries] = useState([{ id: Date.now().toString(), type: 'Work', duration: 8 }]);
  const [expenseItems, setExpenseItems] = useState([]);
  const [perDiemEnabled, setPerDiemEnabled] = useState(false);
  const [perDiemDays, setPerDiemDays] = useState(1);
  const [payrollBurden, setPayrollBurden] = useState(0.092);
  const [avgExpense, setAvgExpense] = useState(0.175);
  const [profitPercent, setProfitPercent] = useState(0.30);

  // Track Hourly vs Salary per employee
  const [employeeTypes, setEmployeeTypes] = useState({});

  // Employees filtered by group
  const employeesInGroup = useMemo(
    () => employeesData.filter(emp => emp.group === selectedGroup),
    [selectedGroup]
  );

  // Map of which employees are included
  const [includedMap, setIncludedMap] = useState({});
  useEffect(() => {
    const map = {};
    employeesInGroup.forEach(emp => { map[emp.id] = true; });
    setIncludedMap(map);
  }, [employeesInGroup]);

  // Default employeeTypes to the data's type field
  useEffect(() => {
    const initial = {};
    employeesInGroup.forEach(emp => {
      initial[emp.id] = emp.type === 'Salary' ? 'Salary' : 'Hourly';
    });
    setEmployeeTypes(initial);
  }, [employeesInGroup]);

  // Toggle type between Hourly and Salary
  const toggleEmployeeType = id => {
    setEmployeeTypes(prev => ({
      ...prev,
      [id]: prev[id] === 'Hourly' ? 'Salary' : 'Hourly'
    }));
  };

  // Include/exclude handlers
  const toggleInclude = id =>
    setIncludedMap(prev => ({ ...prev, [id]: !prev[id] }));
  const selectAll = () => {
    const map = {};
    employeesInGroup.forEach(emp => { map[emp.id] = true; });
    setIncludedMap(map);
  };
  const deselectAll = () => {
    const map = {};
    employeesInGroup.forEach(emp => { map[emp.id] = false; });
    setIncludedMap(map);
  };

  // Manage modal
  const [manageOpen, setManageOpen] = useState(false);
  const openManage = () => setManageOpen(true);
  const closeManage = () => setManageOpen(false);

  // List of currently selected employees
  const selectedEmployees = useMemo(
    () => employeesInGroup.filter(emp => includedMap[emp.id]),
    [employeesInGroup, includedMap]
  );

  // Entry handlers
  const addEntry = () =>
    setEntries(prev => [...prev, { id: Date.now().toString(), type: 'Work', duration: 0 }]);
  const deleteEntry = id =>
    setEntries(prev => prev.filter(e => e.id !== id));
  const reorderEntries = list => setEntries(list);
  const updateEntry = (id, changes) =>
    setEntries(prev => prev.map(e => e.id === id ? { ...e, ...changes } : e));

  // Expense handlers
  const addExpense = () =>
    setExpenseItems(prev => [...prev, { id: Date.now().toString(), description: '', cost: 0, profitable: false }]);
  const updateExpense = (id, changes) =>
    setExpenseItems(prev => prev.map(item => item.id === id ? { ...item, ...changes } : item));
  const deleteExpense = id =>
    setExpenseItems(prev => prev.filter(item => item.id !== id));

  return (
    <div className="p-4 bg-gray-800 min-h-screen relative">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Settings */}
        <div className="flex justify-end">
          <button
            onClick={() => setSettingsOpen(true)}
            className="px-3 py-1 bg-gray-600 text-white rounded"
          >
            Settings
          </button>
        </div>
        {settingsOpen && (
          <>
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-30"
              onClick={() => setSettingsOpen(false)}
            />
            <div className="fixed inset-0 flex items-center justify-center z-40">
              <SettingsModal
                onClose={() => setSettingsOpen(false)}
                payrollBurden={payrollBurden}
                avgExpense={avgExpense}
                profitPercent={profitPercent}
                driveRate={driveRate}
                setPayrollBurden={setPayrollBurden}
                setAvgExpense={setAvgExpense}
                setProfitPercent={setProfitPercent}
                setDriveRate={setDriveRate}
              />
            </div>
          </>
        )}

        {/* Group Selector */}
        <GroupSelector value={selectedGroup} onChange={setSelectedGroup} />

        {/* Employee Table */}
        <EmployeeTable
          employees={selectedEmployees}
          onManage={openManage}
          onDelete={toggleInclude}
          employeeTypes={employeeTypes}
          onToggleType={toggleEmployeeType}
        />

        {/* Manage Employees Modal */}
        {manageOpen && (
          <>
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-30"
              onClick={closeManage}
            />
            <div className="fixed inset-0 flex items-center justify-center z-40">
              <ManageEmployeesModal
                employees={employeesInGroup}
                includedMap={includedMap}
                onToggleInclude={toggleInclude}
                onSelectAll={selectAll}
                onDeselectAll={deselectAll}
                onClose={closeManage}
              />
            </div>
          </>
        )}

        {/* Hours Worked Section */}
        <div>
          
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold text-white">Hours Worked</h2>
            <div className="flex items-center space-x-2">
              <label className="flex items-center space-x-1 text-white">
                <input
                  type="checkbox"
                  checked={overtimeEnabled}
                  onChange={() => setOvertimeEnabled(!overtimeEnabled)}
                  className="form-checkbox"
                />
                <span>Overtime</span>
              </label>
              <button
                onClick={addEntry}
                className="px-3 py-1 bg-indigo-500 text-white rounded"
              >
                Add Entry
              </button>
            </div>
          </div>

          <HoursWorked
            entries={entries}
            onDelete={deleteEntry}
            onUpdateEntry={updateEntry}
            onReorder={reorderEntries}
            overtimeEnabled
           overtimeEnabled={overtimeEnabled}/>
          <HoursSummary entries={entries}  overtimeEnabled={overtimeEnabled}/>
        </div>

        {/* Per Diem Section */}
        <PerDiem
          enabled={perDiemEnabled}
          days={perDiemDays}
          onToggle={() => {
            setPerDiemEnabled(!perDiemEnabled);
            if (!perDiemEnabled) setPerDiemDays(1);
          }}
          onDaysChange={setPerDiemDays}
          peopleCount={selectedEmployees.length}
        />

        {/* Expenses Section */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold text-white">Expenses</h2>
            <button
              onClick={addExpense}
              className="px-3 py-1 bg-indigo-500 text-white rounded"
            >
              Add Expense
            </button>
          </div>
          <Expenses
            expenseItems={expenseItems}
            onUpdateExpense={updateExpense}
            onDeleteExpense={deleteExpense}
          />
        </div>

        {/* Estimator Report */}
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
          driveRate={driveRate}
          employeeTypes={employeeTypes}
         overtimeEnabled={overtimeEnabled}/>
      </div>
    </div>
);
}