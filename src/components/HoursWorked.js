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
              className="border rounded p-1 bg-gray-100"
            >
              <option value="Work">Work</option>
              <option value="Drive">Drive</option>
            </select>
            <input
              type="number"
              value={dur}
              onChange={ev => onUpdateEntry(e.id, { duration: Math.max(0, Number(ev.target.value)) })}
              className="w-16 text-center text-black border rounded mx-4"
            />
            <div className="flex items-center space-x-4">
              <span className="text-black font-medium">{dur} HR</span>
              {ot1 > 0 && <span className="text-red-600">1.5x OT: {ot1}</span>}
              {ot2 > 0 && <span className="text-red-800">2.0x OT: {ot2}</span>}
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
