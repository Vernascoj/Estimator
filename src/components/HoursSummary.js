import React, { useState } from 'react';

export default function HoursSummary({ entries, overtimeEnabled }) {
  const [collapsed, setCollapsed] = useState(true);

  let cumulative = 0;
  let workReg = 0, workOt1 = 0, workOt2 = 0;
  let driveReg = 0, driveOt1 = 0, driveOt2 = 0;

  entries.forEach(e => {
    const dur = e.duration;
    if (!overtimeEnabled) {
      if (e.type === 'Work') workReg += dur;
      else driveReg += dur;
      cumulative += dur;
    } else {
      const prevCum = cumulative;
      cumulative += dur;

      if (e.straightOT) {
        if (e.type === 'Work') workOt1 += dur;
        else driveOt1 += dur;
      } else {
        const regH = Math.min(dur, Math.max(0, 8 - prevCum));
        let rem = dur - regH;
        const ot1 = Math.min(rem, Math.max(0, 12 - (prevCum + regH)));
        rem -= ot1;
        const ot2 = rem;
        if (e.type === 'Work') {
          workReg += regH;
          workOt1 += ot1;
          workOt2 += ot2;
        } else {
          driveReg += regH;
          driveOt1 += ot1;
          driveOt2 += ot2;
        }
      }
    }
  });

  return (
    <div className="p-4 rounded space-y-2 bg-transparent">
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="w-full text-left text-white font-semibold"
      >
        Hours Summary {collapsed ? '+' : '-'}
      </button>
      {!collapsed && (
        <div className="text-white space-y-2 text-sm">
          <div>
            <span className="font-medium">Work:</span> {workReg + workOt1 + workOt2} hr
            {workOt1 > 0 && <span> (+{workOt1} OT @1.5×)</span>}
            {workOt2 > 0 && <span> (+{workOt2} OT @2.0×)</span>}
          </div>
          <div>
            <span className="font-medium">Drive:</span> {driveReg + driveOt1 + driveOt2} hr
            {driveOt1 > 0 && <span> (+{driveOt1} OT @1.5×)</span>}
            {driveOt2 > 0 && <span> (+{driveOt2} OT @2.0×)</span>}
          </div>
          <hr className="border-gray-700" />
        </div>
      )}
    </div>
  );
}