import React from 'react';

export default function PerDiem({ enabled, days, onToggle, onDaysChange, peopleCount }) {
  const cost = peopleCount * days * 50;
  // use bg-indigo-600 when enabled, bg-gray-600 when disabled
  return (
    <div className={`flex items-center justify-between p-4 mb-4 rounded shadow ${enabled ? 'bg-indigo-600' : 'bg-gray-600'}`}>
      <div>
        <div className="text-xl font-semibold text-white">Per Diem</div>
        <div className="mt-2 flex items-center">
          <label className="text-white mr-2">Days:</label>
          <input
            type="number"
            value={days}
            min={1}
            onChange={e => onDaysChange(Math.max(1, Number(e.target.value)))}
            disabled={!enabled}
            className="w-16 px-2 py-1 rounded text-black"
          />
        </div>
        <div className="mt-2 text-white">
          {peopleCount} people × {days} days × $50 = ${cost.toFixed(2)}
        </div>
      </div>
      <button
        onClick={onToggle}
        className={`px-4 py-2 rounded text-white ${enabled ? 'bg-indigo-500 hover:bg-indigo-700' : 'bg-gray-400'}`}
      >
        {enabled ? 'On' : 'Off'}
      </button>
    </div>
  );
}
