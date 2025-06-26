import React from 'react';
import { Trash2 } from 'lucide-react';

export default function HoursWorked({ entries, onDelete, onUpdateEntry, overtimeEnabled }) {
  let cumulative = 0;
  return (
    <div className="space-y-2">
      {entries.map(e => {
        const dur = e.duration;
        let rem = dur;
        const reg = overtimeEnabled ? Math.min(rem, Math.max(0, 8 - cumulative)) : dur;
        rem -= reg;
        const ot1 = overtimeEnabled ? Math.min(rem, Math.max(0, 12 - (cumulative + reg))) : 0;
        rem -= ot1;
        const ot2 = overtimeEnabled ? rem : 0;
        cumulative += dur;

        return (
          <div key={e.id} className="flex justify-between items-center bg-white p-2 rounded shadow">
            <select
              value={e.type}
              onChange={ev => onUpdateEntry(e.id, { type: ev.target.value })}
              className="p-1 border rounded bg-gray-200 text-black"
            >
              <option value="Work">Work</option>
              <option value="Drive">Drive</option>
            </select>
            <input
              type="number"
              value={dur}
              readOnly
              className="w-16 text-center text-black border rounded mx-auto"
            />
            <div className="flex flex-col items-center text-sm space-y-1">
              {ot1 > 0 && <span className="text-red-600">1.5x {ot1}</span>}
              {ot2 > 0 && <span className="text-red-800">2.0x {ot2}</span>}
            </div>
            <button onClick={() => onDelete(e.id)} className="p-1 hover:bg-gray-100 rounded">
              <Trash2 className="h-5 w-5 text-red-500" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
