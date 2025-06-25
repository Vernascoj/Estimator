import React, { useState, useEffect, useMemo } from 'react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from './components/ui/select';
import { Button } from './components/ui/button';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from './components/ui/dialog';
import { Input } from './components/ui/input';
import { Switch } from './components/ui/switch';
import { Label } from './components/ui/label';

// Sample employee data hard-coded
const employeesData = [
  { id: '1', firstName: 'Randy', lastName: 'Batchelor', rate: 25.5, group: 'UTAH' },
  { id: '2', firstName: 'Victor', lastName: 'Dominguez', rate: 26.5, group: 'UTAH' },
  // … add your other employees here …
];
const groupOptions = Array.from(new Set(employeesData.map(e => e.group)));

function Header({ selectedGroup, setSelectedGroup, driveRate, setDriveRate, expensePct, setExpensePct, payrollPct, setPayrollPct }) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);
  return (
    <header className="flex items-center justify-between px-4 py-3 bg-gray-900 dark:bg-white">
      <Select value={selectedGroup} onValueChange={setSelectedGroup}>
        <SelectTrigger className="w-48 text-black">
          <SelectValue placeholder="Select Group" className="text-black" />
        </SelectTrigger>
        <SelectContent>
          {groupOptions.map(g => (
            <SelectItem key={g} value={g} className="text-black">{g}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="flex items-center space-x-2">
        <Switch checked={darkMode} onCheckedChange={setDarkMode} /><Label>Dark Mode</Label>
      </div>
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="flex items-center">
            <Settings className="mr-2" />Settings
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
            <DialogDescription>Set rates and percentages</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <Label htmlFor="driveRate">Drive Rate ($/hr)</Label>
            <Input id="driveRate" type="number" step="0.01" value={driveRate}
              onChange={e => setDriveRate(parseFloat(e.target.value) || 0)} />
            <Label htmlFor="expensePct">Avg Expense (%)</Label>
            <Input id="expensePct" type="number" step="0.1" value={expensePct}
              onChange={e => setExpensePct(parseFloat(e.target.value) || 0)} />
            <Label htmlFor="payrollPct">Payroll Burden (%)</Label>
            <Input id="payrollPct" type="number" step="0.1" value={payrollPct}
              onChange={e => setPayrollPct(parseFloat(e.target.value) || 0)} />
          </div>
          <DialogFooter><DialogClose>Done</DialogClose></DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
}

function EmployeeSelector({ open, onOpenChange, visibleEmployees, includedMap, toggleInclude }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild><Button variant="outline">Manage Employees</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Employees</DialogTitle>
          <DialogDescription>Tap to include/exclude</DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          {visibleEmployees.map(emp => (
            <div key={emp.id} onClick={() => toggleInclude(emp.id)}
              className={`flex items-center p-2 rounded border ${
                includedMap[emp.id] ? 'bg-blue-50 border-blue-400' : 'opacity-50 border-gray-300'
              }`}>
              <span className="flex-1">{emp.firstName} {emp.lastName}</span>
              <span>${emp.rate.toFixed(2)}/hr</span>
            </div>
          ))}
        </div>
        <DialogFooter><DialogClose>Close</DialogClose></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function EmployeeList({ employees, onOpenSelector }) {
  if (!employees.length) return <p>No employees selected.</p>;
  return (
    <div className="space-y-2">
      {employees.map(emp => (
        <div key={emp.id} onClick={onOpenSelector}
          className="flex justify-between items-center p-2 border rounded cursor-pointer">
          <span>{emp.firstName} {emp.lastName}</span>
          <span>${emp.rate.toFixed(2)}/hr</span>
        </div>
      ))}
    </div>
  );
}

function HoursWorked({ overtimeOn, setOvertimeOn, entries, setEntries }) {
  const addEntry = () => setEntries(prev => [...prev, { id: Date.now().toString(), type: 'Work', hours: '' }]);
  const updateEntry = (id, field, val) => setEntries(prev =>
    prev.map(e => e.id === id ? { ...e, [field]: val } : e)
  );
  const removeEntry = id => setEntries(prev => prev.filter(e => e.id !== id));

  let cum = 0;
  const display = entries.map(e => {
    const h = parseFloat(e.hours) || 0, item = { ...e };
    if (e.type === 'Work' && overtimeOn && cum + h > 8) {
      item.ot = cum + h - 8;
    }
    cum += h;
    return item;
  });

  return (
    <section className="mt-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">Hours Worked</h3>
        <div className="flex items-center space-x-2">
          <Switch checked={overtimeOn} onCheckedChange={setOvertimeOn} /><Label>Overtime</Label>
          <Button onClick={addEntry} variant="outline"><Plus/></Button>
        </div>
      </div>
      <div className="space-y-2">
        {display.map(entry => (
          <div key={entry.id} className="flex justify-between items-center p-2 border rounded">
            <div className="flex items-center space-x-2">
              {entry.ot > 0 && <span className="text-red-600">OT:{entry.ot.toFixed(2)}h</span>}
              <select value={entry.type} onChange={e => updateEntry(entry.id, 'type', e.target.value)}>
                <option>Work</option><option>Drive</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <Input type="number" min={0} step={0.25} value={entry.hours}
                onChange={e => updateEntry(entry.id,
