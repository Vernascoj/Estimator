import React, { useState } from 'react';

export default function HoursSummary({ entries }) {
  const [collapsed, setCollapsed] = useState(true);

  // Calculate totals
  let cumulative = 0;
  let workReg = 0, workOt1 = 0, workOt2 = 0;
  let driveReg = 0, driveOt1 = 0, driveOt2 = 0;

  entries.forEach(e => {
    const dur = e.duration;
    let rem = dur;
    // regular
    const reg = Math.min(rem, Math.max(0, 8 - cumulative));
    rem -= reg;
    // OT1
    const ot1 = Math.min(rem, Math.max(0, 12 - (cumulative + reg)));
    rem -= ot1;
    // OT2
    const ot2 = rem;
    cumulative += dur;

    if (e.type === 'Work') {
      workReg += reg;
      workOt1 += ot1;
      workOt2 += ot2;
    } else {
      driveReg += reg;
      driveOt1 += ot1;
      driveOt2 += ot2;
    }
  });

  const workTotal = workReg + workOt1 + workOt2;
  const driveTotal = driveReg + driveOt1 + driveOt2;
  const totalReg = workReg + driveReg;
  const totalHours = totalReg + workOt1 + workOt2 + driveOt1 + driveOt2;

  return (
    <div className="p-4 bg-gray-800 rounded space-y-2">
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="w-full text-left text-white font-semibold"
      >
        Hours Summary {collapsed ? '+' : '-'}
      </button>
      {!collapsed && (
        <div className="text-white space-y-2">
          <div>
            <span className="font-medium">Work:</span> {workTotal} hr
            {(workOt1 > 0 || workOt2 > 0) && (
              <span> (
                {workOt1 > 0 && `+${workOt1} OT @1.5x${workOt2 > 0 ? ', ' : ''}`}
                {workOt2 > 0 && `+${workOt2} OT @2.0x`}
              )</span>
            )}
          </div>
          <div>
            <span className="font-medium">Drive:</span> {driveTotal} hr
            {(driveOt1 > 0 || driveOt2 > 0) && (
              <span> (
                {driveOt1 > 0 && `+${driveOt1} OT @1.5x${driveOt2 > 0 ? ', ' : ''}`}
                {driveOt2 > 0 && `+${driveOt2} OT @2.0x`}
              )</span>
            )}
          </div>
          <hr className="border-gray-700" />
          <div>
            <span className="font-medium">Total:</span> {totalHours} hr
          </div>
        </div>
      )}
    </div>
  );
}
