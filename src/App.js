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
import { Settings, Plus, Trash2 } from 'lucide-react';

// Sample employee data hard-coded
const employeesData = [
  { id: '1', firstName: 'Randy', lastName: 'Batchelor', rate: 25.5, group: 'UTAH' },
  { id: '2', firstName: 'Victor', lastName: 'Dominguez', rate: 26.5, group: 'UTAH' },
  // … add additional employees …
];
const groupOptions = Array.from(new Set(employeesData.map(e => e.group)));

function Header({
  selectedGroup, setSelectedGroup,
  driveRate, setDriveRate,
  expensePct, setExpensePct,
  payrollPct, setPayrollPct,
}) {
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
            <SelectItem key={g} value={g} className="text-black">
              {g}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="flex items-center space-x-2">
        <Switch checked={darkMode} onCheckedChange={setDarkMode} />
        <Label>Dark Mode</Label>
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
            <Input
              id="driveRate"
              type="number"
              step="0.01"
              value={driveRate}
              onChange={e => setDriveRate(parseFloat(e.target.value) || 0)}
            />
            <Label htmlFor="expensePct">Avg Expense (%)</Label>
            <Input
              id="expensePct"
              type="number"
              step="0.1"
              value={expensePct}
              onChange={e => setExpensePct(parseFloat(e.target.value) || 0)}
            />
            <Label htmlFor="payrollPct">Payroll Burden (%)</Label>
            <Input
              id="payrollPct"
              type="number"
              step="0.1"
              value={payrollPct}
              onChange={e => setPayrollPct(parseFloat(e.target.value) || 0)}
            />
          </div>
