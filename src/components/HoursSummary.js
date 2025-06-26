import React, { useState } from 'react';

export default function HoursSummary({ entries }) {
  const [collapsed, setCollapsed] = useState(true);

  let cumulative = 0;
  const totals = {
    workReg: 0, workOt1: 0, workOt2: 0,
    driveReg: 0, driveOt1: 0, driveOt2: 0
  };

  entries.forEach(e => {
    const dur = e.duration;
    let rem = dur;
    const reg = Math.min(rem, Math.max(0, 8 - cumulative));
    rem -= reg;
    const ot1 = Math.min(rem, Math.max(0, 12 - (cumulative + reg)));
    rem -= ot1;
    const ot2 = rem;
    cumulative += dur;

    const key = e.type.toLowerCase();
    totals[`${key}Reg`] += reg;
    totals[`${key}Ot1`] += ot1;
    totals[`${key}Ot2`] += ot2;
  });

  return (
    <div className="bg-white p-2 rounded shadow">
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setCollapsed(!collapsed)}
      >
        <span className="text-sm font-semibold">Hours Summary</span>
        <span className="text-sm">{collapsed ? '+' : '−'}</span>
      </div>
      {!collapsed && (
        <div className="mt-2 space-y-1">
          {/* Work breakdown */}
          <div className="flex justify-between text-sm">
            <span>Work:</span>
            <span>
              {totals.workReg} Reg
              {totals.workOt1 > 0 && `, ${totals.workOt1} OT1.5`}
              {totals.workOt2 > 0 && `, ${totals.workOt2} OT2.0`}
            </span>
          </div>
          {/* Drive breakdown if any */}
          {(totals.driveReg > 0 || totals.driveOt1 > 0 || totals.driveOt2 > 0) && (
            <div className="flex justify-between text-sm">
              <span>Drive:</span>
              <span>
                {totals.driveReg} Reg
                {totals.driveOt1 > 0 && `, ${totals.driveOt1} OT1.5`}
                {totals.driveOt2 > 0 && `, ${totals.driveOt2} OT2.0`}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
