import React, { useState, useMemo } from 'react';

export default function HoursSummary({ entries }) {
  const [open, setOpen] = useState(false);
  const summary = useMemo(() => {
    let cum = 0;
    const stats = { reg: 0, ot1: 0, ot2: 0, regWork: 0, regDrive: 0, ot1Work: 0, ot1Drive: 0, ot2Work: 0, ot2Drive: 0 };
    entries.forEach(e => {
      const dur = Number(e.duration), type = e.type;
      const start = cum, end = start + dur;
      const thisOt1 = Math.max(0, Math.min(end, 12) - Math.max(start, 8));
      const thisOt2 = Math.max(0, end - Math.max(start, 12));
      const thisReg = dur - thisOt1 - thisOt2;
      stats.reg += thisReg; stats.ot1 += thisOt1; stats.ot2 += thisOt2;
      if (type === 'Work') {
        stats.regWork += thisReg; stats.ot1Work += thisOt1; stats.ot2Work += thisOt2;
      } else {
        stats.regDrive += thisReg; stats.ot1Drive += thisOt1; stats.ot2Drive += thisOt2;
      }
      cum = end;
    });
    stats.total = stats.reg + stats.ot1 + stats.ot2;
    return stats;
  }, [entries]);

  return (
    <div className="mt-4 bg-white dark:bg-gray-700 rounded-lg shadow p-4">
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-semibold text-white">Hours Summary</h4>
        <button onClick={() => setOpen(o => !o)} className="text-white">
          {open ? 'Collapse' : 'Expand'}
        </button>
      </div>
      {open && (
        <div className="mt-2 space-y-1 text-white">
          <div className="flex justify-between border-b pb-1">
            <span>Regular Hours</span><span>{summary.reg}</span>
          </div>
          <div className="flex justify-between pl-4 text-sm">
            <span>Work</span><span>{summary.regWork}</span>
          </div>
          <div className="flex justify-between pl-4 text-sm border-b pb-1">
            <span>Drive</span><span>{summary.regDrive}</span>
          </div>
          {summary.ot1 > 0 && (
            <>
              <div className="flex justify-between border-b pb-1">
                <span>OT 1.5×</span><span>{summary.ot1}</span>
              </div>
              <div className="flex justify-between pl-4 text-sm">
                <span>Work</span><span>{summary.ot1Work}</span>
              </div>
              <div className="flex justify-between pl-4 text-sm border-b pb-1">
                <span>Drive</span><span>{summary.ot1Drive}</span>
              </div>
            </>
          )}
          {summary.ot2 > 0 && (
            <>
              <div className="flex justify-between border-b pb-1">
                <span>OT 2.0×</span><span>{summary.ot2}</span>
              </div>
              <div className="flex justify-between pl-4 text-sm">
                <span>Work</span><span>{summary.ot2Work}</span>
              </div>
              <div className="flex justify-between pl-4 text-sm border-b pb-1">
                <span>Drive</span><span>{summary.ot2Drive}</span>
              </div>
            </>
          )}
          <div className="flex justify-between pt-2 font-semibold">
            <span>Total Hours</span><span>{summary.total}</span>
          </div>
        </div>
      )}
    </div>
  );
}
