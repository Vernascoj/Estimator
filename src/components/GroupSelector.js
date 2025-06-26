import React from 'react';

export default function GroupSelector({ value, onChange }) {
  const groups = ['ATKINS', 'GLADE', 'RANDY', 'FRAN', 'CARY', 'NORCAL', 'ARKANSAS', 'MIKE', 'UTAH'];

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-3 py-2 border rounded"
    >
      {groups.map((g) => (
        <option key={g} value={g}>
          {g}
        </option>
      ))}
    </select>
  );
}
