import React, { useMemo, useState } from 'react';

export default function HoursSummary({ entries }) {
  const [expanded, setExpanded] = useState(false);
  const total = useMemo(() => entries.reduce((sum, e) => sum + e.duration, 0), [entries]);
  const reg = Math.min(total, 8);
  const ot = Math.max(total - 8, 0);

  return (
    <div className="bg-gray-700 p-3 rounded text-white">
      <div className="flex justify-between items-center cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <span className="font-semibold">Hours Summary</span>
        <span>{expanded ? '▲' : '▼'}</span>
      </div>
      {expanded && (
        <div className="mt-2 space-y-1">
          <div>Total Hours: {total}</div>
          <div>Regular: {reg}</div>
          <div>Overtime: {ot}</div>
        </div>
      )}
    </div>
  );
}
