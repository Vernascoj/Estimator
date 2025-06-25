import React, { useState, useEffect, useMemo } from 'react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Settings, Plus, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

// Sample employee data hard-coded
const employeesData = [
  { id: '1', firstName: 'Randy', lastName: 'Batchelor', rate: 25.5, group: 'UTAH' },
  { id: '2', firstName: 'Victor', lastName: 'Dominguez', rate: 26.5, group: 'UTAH' },
  // … other entries …
];
const groupOptions = Array.from(new Set(employeesData.map(emp => emp.group)));

function Header({
  selectedGroup, setSelectedGroup,
  driveRate, setDriveRate,
  expensePct, setExpensePct,
  payrollPct, setPayrollPct
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
            <SelectItem key={g} value={g} className="text-black">{g}</SelectItem>
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
            <Input id="driveRate" type="number" step="0.01" value={driveRate}
                   onChange={e => setDriveRate(parseFloat(e.target.value)||0)} />
            <Label htmlFor="expensePct">Avg Expense (%)</Label>
            <Input id="expensePct" type="number" step="0.1" value={expensePct}
                   onChange={e => setExpensePct(parseFloat(e.target.value)||0)} />
            <Label htmlFor="payrollPct">Payroll Burden (%)</Label>
            <Input id="payrollPct" type="number" step="0.1" value={payrollPct}
                   onChange={e => setPayrollPct(parseFloat(e.target.value)||0)} />
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
            <div key={emp.id}
                 onClick={() => toggleInclude(emp.id)}
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
  const updateEntry = (id, field, val) => setEntries(prev => prev.map(e => e.id===id ? { ...e, [field]: val } : e));
  const removeEntry = id => setEntries(prev => prev.filter(e => e.id!==id));

  let cum = 0;
  const display = entries.map(e => {
    const h = parseFloat(e.hours)||0, item = {...e};
    if (e.type==='Work' && overtimeOn && cum+h>8) {
      item.ot = cum+h-8;
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
              {entry.ot>0 && <span className="text-red-600">OT:{entry.ot.toFixed(2)}h</span>}
              <select value={entry.type} onChange={e=>updateEntry(entry.id,'type',e.target.value)}>
                <option>Work</option><option>Drive</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <Input type="number" min={0} step={0.25} value={entry.hours}
                     onChange={e=>updateEntry(entry.id,'hours',e.target.value)}
                     placeholder="Hours" className="w-24"/>
              <Button variant="ghost" onClick={()=>removeEntry(entry.id)}><Trash2/></Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function PerDiem({ perDiemOn, setPerDiemOn, days, setDays }) {
  return (
    <section className="mt-6">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">Per Diem</h3>
        <div className="flex items-center space-x-2">
          <Switch checked={perDiemOn} onCheckedChange={setPerDiemOn}/><Label>Per Diem</Label>
        </div>
      </div>
      {perDiemOn && (
        <div className="flex items-center space-x-2 p-2 border rounded">
          <Label>Days:</Label>
          <Input type="number" min={1} value={days}
                 onChange={e=>setDays(Number(e.target.value))}
                 className="w-24"/>
        </div>
      )}
    </section>
  );
}

function ExpenseTable({ title, entries, setEntries }) {
  const addEntry = () => setEntries(prev => [...prev, { id: Date.now().toString(), desc:'', amount:'' }]);
  const updateEntry = (id, field, val) => setEntries(prev => prev.map(e=>e.id===id ? {...e,[field]:val}:e));
  const removeEntry = id => setEntries(prev => prev.filter(e=>e.id!==id));

  return (
    <section className="mt-6">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        <Button onClick={addEntry} variant="outline"><Plus/></Button>
      </div>
      <div className="space-y-2">
        {entries.map(entry=>(
          <div key={entry.id} className="flex justify-between items-center p-2 border rounded">
            <Input placeholder="Description" value={entry.desc}
                   onChange={e=>updateEntry(entry.id,'desc',e.target.value)}
                   className="flex-1 mr-2"/>
            <Input type="number" placeholder="Amount" value={entry.amount}
                   onChange={e=>updateEntry(entry.id,'amount',e.target.value)}
                   className="w-24 mr-2"/>
            <Button variant="ghost" onClick={()=>removeEntry(entry.id)}><Trash2/></Button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function App() {
  const [selectedGroup, setSelectedGroup] = useState(groupOptions[0]);
  const [includedMap, setIncludedMap] = useState(()=>
    employeesData.reduce((a,e)=>(a[e.id]=true,a),{})
  );
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [driveRate, setDriveRate] = useState(17.5);
  const [expensePct, setExpensePct] = useState(12.6);
  const [payrollPct, setPayrollPct] = useState(9.2);
  const [overtimeOn, setOvertimeOn] = useState(true);
  const [entries, setEntries] = useState([]);
  const [perDiemOn, setPerDiemOn] = useState(false);
  const [days, setDays] = useState(1);
  const [travelEntries, setTravelEntries] = useState([]);
  const [rentalEntries, setRentalEntries] = useState([]);
  const [profitPct, setProfitPct] = useState(30);

  const visibleEmployees = useMemo(
    () => employeesData.filter(e=>e.group===selectedGroup),
    [selectedGroup]
  );
  const selectedEmployees = useMemo(
    () => visibleEmployees.filter(e=>includedMap[e.id]),
    [visibleEmployees, includedMap]
  );
  const avgRate = useMemo(
    () => selectedEmployees.reduce((sum,e)=>sum+e.rate,0)/(selectedEmployees.length||1),
    [selectedEmployees]
  );

  return (
    <div className="p-4">
      <Header
        selectedGroup={ selectedGroup } setSelectedGroup={ setSelectedGroup }
        driveRate={ driveRate } setDriveRate={ setDriveRate }
        expensePct={ expensePct } setExpensePct={ setExpensePct }
        payrollPct={ payrollPct } setPayrollPct={ setPayrollPct }
      />

      <EmployeeSelector
        open={ selectorOpen }
        onOpenChange={ setSelectorOpen }
        visibleEmployees={ visibleEmployees }
        includedMap={ includedMap }
        toggleInclude={ id => setIncludedMap(prev=>({ ...prev, [id]:!prev[id] })) }
      />

      <EmployeeList employees={ selectedEmployees } onOpenSelector={()=>setSelectorOpen(true)}/>

      <HoursWorked
        overtimeOn={ overtimeOn } setOvertimeOn={ setOvertimeOn }
        entries={ entries } setEntries={ setEntries }
      />

      <PerDiem
        perDiemOn={ perDiemOn } setPerDiemOn={ setPerDiemOn }
        days={ days } setDays={ setDays }
      />

      <ExpenseTable title="Travel Costs" entries={ travelEntries } setEntries={ setTravelEntries }/>
      <ExpenseTable title="Rental Costs" entries={ rentalEntries } setEntries={ setRentalEntries }/>

      {/* === Job Cost Report === */}
      <section className="mt-8 p-4 border rounded">
        <h3 className="text-xl font-semibold mb-4">Job Cost Report</h3>

        {/* Total Labor Cost */}
        {(() => {
          let cum=0, perEmpCost=0;
          entries.filter(e=>e.type==='Work').forEach(e=>{
            const h=parseFloat(e.hours)||0;
            if(overtimeOn){
              const reg = Math.max(0,Math.min(8-cum,h));
              const ot  = Math.max(0,Math.min(12-(cum+reg),h-reg));
              const dt  = Math.max(0,h-reg-ot);
              perEmpCost += reg*avgRate + ot*avgRate*1.5 + dt*avgRate*2;
            } else {
              perEmpCost += h*avgRate;
            }
            cum+=h;
          });
          const totalLaborCost = perEmpCost*selectedEmployees.length*(1+payrollPct/100);
          return (
            <div className="mb-2">
              <span className="font-medium">Total Labor Cost:</span>{' '}
              ${ totalLaborCost.toFixed(2) }
            </div>
          );
        })()}

        {/* Average Expenses */}
        <div className="mb-2">
          <span className="font-medium">Average Expenses:</span>{' '}
          {(
            entries.filter(e=>e.type==='Work').reduce((s,e)=>s+(parseFloat(e.hours)||0),0) *
            avgRate *
            selectedEmployees.length *
            (1+payrollPct/100) *
            (expensePct/100)
          ).toFixed(2)}
        </div>

        {/* Editable Profit % */}
        <div className="flex items-center mb-2">
          <Label>Profit %:</Label>
          <Input
            type="number" step="1" min="0" value={profitPct}
            onChange={e=>setProfitPct(parseFloat(e.target.value)||0)}
            className="w-20 ml-2"
          />
        </div>

        {/* Profit $ */}
        {(() => {
          let cum=0, perEmpCost=0;
          entries.filter(e=>e.type==='Work').forEach(e=>{
            const h=parseFloat(e.hours)||0;
            if(overtimeOn){
              const reg = Math.max(0,Math.min(8-cum,h));
              const ot  = Math.max(0,Math.min(12-(cum+reg),h-reg));
              const dt  = Math.max(0,h-reg-ot);
              perEmpCost += reg*avgRate + ot*avgRate*1.5 + dt*avgRate*2;
            } else {
              perEmpCost += h*avgRate;
            }
            cum+=h;
          });
          const laborWithBurden = perEmpCost*selectedEmployees.length*(1+payrollPct/100);
          const avgExpAmt       = laborWithBurden*(expensePct/100);
          const profitAmt       = (laborWithBurden+avgExpAmt)*(profitPct/100)/(1-profitPct/100);
          return (
            <div className="mb-4">
              <span className="font-medium">Profit:</span>{' '}
              ${ profitAmt.toFixed(2) }
            </div>
          );
        })()}

        {/* Additional Expenses */}
        {[
          { title:'Per Diem', amount: perDiemOn?days*50*selectedEmployees.length:0 },
          { title:'Travel',   amount: travelEntries.reduce((a,e)=>a+(parseFloat(e.amount)||0),0) },
          { title:'Rental',   amount: rentalEntries.reduce((a,e)=>a+(parseFloat(e.amount)||0),0) },
        ].map(({title,amount})=>amount>0?(
          <div key={title} className="mb-2">
            <span className="font-medium">{title}:</span>{' '}
            ${ amount.toFixed(2) }
          </div>
        ):null)}

        {/* Total Job Cost */}
        {(() => {
          let cum=0, perEmpCost=0;
          entries.filter(e=>e.type==='Work').forEach(e=>{
            const h=parseFloat(e.hours)||0;
            if(overtimeOn){
              const reg = Math.max(0,Math.min(8-cum,h));
              const ot  = Math.max(0,Math.min(12-(cum+reg),h-reg));
              const dt  = Math.max(0,h-reg-ot);
              perEmpCost += reg*avgRate + ot*avgRate*1.5 + dt*avgRate*2;
            } else {
              perEmpCost += h*avgRate;
            }
            cum+=h;
          });
          const laborWithBurden = perEmpCost*selectedEmployees.length*(1+payrollPct/100);
          const avgExpAmt       = laborWithBurden*(expensePct/100);
          const profitAmt       = (laborWithBurden+avgExpAmt)*(profitPct/100)/(1-profitPct/100);
          const extraExpenses   =
            (perDiemOn?days*50*selectedEmployees.length:0) +
            travelEntries.reduce((a,e)=>a+(parseFloat(e.amount)||0),0) +
            rentalEntries.reduce((a,e)=>a+(parseFloat(e.amount)||0),0);
          const totalJobCost = laborWithBurden + avgExpAmt + profitAmt + extraExpenses;
          return (
            <div className="mt-4 text-lg font-semibold">
              Total Job Cost: ${ totalJobCost.toFixed(2) }
            </div>
          );
        })()}
      </section>
    </div>
  );
}