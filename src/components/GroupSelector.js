import React from 'react';
import employeesData from '../data/employeesData';

export default function GroupSelector({ value, onChange }) {
  const uniqueGroups = Array.from(new Set(employeesData.map(emp => emp.group)));
  const groups = [...uniqueGroups, 'All'];

  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="p-2 bg-white text-black rounded"
    >
      {groups.map(g => (
        <option key={g} value={g}>{g}</option>
      ))}
    </select>
  );
}
