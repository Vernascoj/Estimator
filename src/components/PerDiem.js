import React from 'react';

export default function PerDiem({
  enabled,
  days,
  onToggle,
  onDaysChange,
  peopleCount
}) {
  const cost = peopleCount * days * 50;

  return (
    <div className="bg-white p-4 rounded mb-4">
      <div className="flex justify-between items-center">
        <span className="font-medium text-gray-800">Per Diem</span>
        <label className="inline-flex items-center space-x-2">
          <input
            type="checkbox"
            checked={enabled}
            onChange={onToggle}
            className="form-checkbox h-5 w-5 text-indigo-600"
          />
        </label>
      </div>
      {enabled && (
        <div className="mt-4 space-y-3">
          <div className="flex items-center space-x-2">
            <label className="text-gray-700">Days:</label>
            <input
              type="number"
              onFocus={e => e.target.select()}
              defaultValue={days}
              min={1}
              onBlur={e => onDaysChange(Math.max(1, Number(e.target.value)))}
              className="w-20 text-center text-gray-800 border rounded p-1"
            />
          </div>
          <div className="text-gray-700 font-medium">
            {peopleCount} people × {days} days × $50 = ${cost.toFixed(2)}
          </div>
        </div>
      )}
    </div>
  );
}
