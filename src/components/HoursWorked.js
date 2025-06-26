import React, { useMemo, useState } from 'react';
import { Trash2, Plus } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

export default function HoursWorked({
  entries,
  onAdd,
  onDelete,
  onReorder,
  overtimeEnabled,
  setOvertimeEnabled
}) {
  // Summary collapsed by default
  const [summaryOpen, setSummaryOpen] = useState(false);

  // Calculate regular and overtime for each entry
  const computed = useMemo(() => {
    let cum = 0;
    return entries.map(entry => {
      const dur = Number(entry.duration);
      const start = cum;
      const end = start + dur;
      const ot1 = overtimeEnabled ? Math.max(0, Math.min(end, 12) - Math.max(start, 8)) : 0;
      const ot2 = overtimeEnabled ? Math.max(0, end - Math.max(start, 12)) : 0;
      cum = end;
      return { ...entry, ot1, ot2 };
    });
  }, [entries, overtimeEnabled]);

  // Totals aggregated
  const totals = computed.reduce((acc, e) => {
    const key = e.type.toLowerCase();
    acc[key + 'Reg'] = (acc[key + 'Reg'] || 0) + (e.duration - e.ot1 - e.ot2);
    acc[key + 'Ot1'] = (acc[key + 'Ot1'] || 0) + e.ot1;
    acc[key + 'Ot2'] = (acc[key + 'Ot2'] || 0) + e.ot2;
    return acc;
  }, { workReg: 0, workOt1: 0, workOt2: 0, driveReg: 0, driveOt1: 0, driveOt2: 0 });

  const handleDragEnd = result => {
    if (!result.destination) return;
    const list = Array.from(entries);
    const [moved] = list.splice(result.source.index, 1);
    list.splice(result.destination.index, 0, moved);
    onReorder(list);
  };

  return (
    <div className="mt-6">
      {/* Controls: Add Entry and Overtime toggle */}
      <div className="flex justify-end items-center mb-4 space-x-2">
        <button
          onClick={onAdd}
          className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 flex items-center space-x-1"
        >
          <Plus className="h-5 w-5" />
          <span>Add Entry</span>
        </button>
        <label className="flex items-center space-x-1">
          <input
            type="checkbox"
            checked={overtimeEnabled}
            onChange={e => setOvertimeEnabled(e.target.checked)}
            className="h-4 w-4"
          />
          <span>Overtime</span>
        </label>
      </div>

      {entries.length === 0 ? (
        <p className="text-gray-700 dark:text-gray-300">No entries.</p>
      ) : (
        <>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="hours">
              {provided => (
                <div ref={provided.innerRef} {...provided.droppableProps}
                     className="overflow-x-auto bg-white dark:bg-gray-800 shadow rounded-lg">
                  <table className="min-w-full table-fixed">
                    <thead className="bg-gray-100 dark:bg-gray-900">
                      <tr>
                        <th className="w-1/3 px-6 py-3 text-left">Class</th>
                        <th className="w-1/3 px-6 py-3 text-center">Duration</th>
                        <th className="w-1/3 px-6 py-3 text-right"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {computed.map((entry, idx) => (
                        <Draggable key={entry.id} draggableId={entry.id} index={idx}>
                          {prov => (
                            <tr ref={prov.innerRef} {...prov.draggableProps} {...prov.dragHandleProps}
                                className="even:bg-gray-50 odd:bg-white dark:even:bg-gray-900 dark:odd:bg-gray-800">
                              <td className="px-6 py-4">
                                <select
                                  value={entry.type}
                                  onChange={e => {
                                    const u = [...entries];
                                    u[idx].type = e.target.value;
                                    onReorder(u);
                                  }}
                                  className="px-2 py-1 border rounded"
                                >
                                  <option>Work</option>
                                  <option>Drive</option>
                                </select>
                              </td>
                              <td className="px-6 py-4 relative text-center">
                                <input
                                  type="number"
                                  value={entry.duration}
                                  onChange={e => {
                                    const u = [...entries];
                                    u[idx].duration = Number(e.target.value);
                                    onReorder(u);
                                  }}
                                  className="w-20 px-2 py-1 border rounded text-right"
                                />
                                {/* OT badges */}
                                {entry.ot1 > 0 && (
                                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-orange-600 text-sm font-medium">
                                    {entry.ot1.toFixed(2)}h×1.5
                                  </span>
                                )}
                                {entry.ot2 > 0 && (
                                  <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-red-600 text-sm font-medium">
                                    {entry.ot2.toFixed(2)}h×2.0
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-4 text-right">
                                <button
                                  onClick={() => onDelete(entry.id)}
                                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                                >
                                  <Trash2 className="h-5 w-5 text-red-500" />
                                </button>
                              </td>
                            </tr>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </tbody>
                  </table>
                </div>
              )}
            </Droppable>
          </DragDropContext>

          {/* Summary */}
          <div className="mt-4">
            <button
              onClick={() => setSummaryOpen(!summaryOpen)}
              className="text-blue-600 hover:underline"
            >
              {summaryOpen ? 'Hide Summary' : 'Show Summary'}
            </button>
            {summaryOpen && (
              <div className="mt-2 p-4 bg-white dark:bg-gray-900 border rounded-lg text-gray-700 dark:text-gray-300">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="font-semibold">Work</div>
                    <div className="flex justify-between"><span>Regular</span><span>{totals.workReg.toFixed(2)}h</span></div>
                    <div className="flex justify-between"><span className="text-orange-600">OT×1.5</span><span>{totals.workOt1.toFixed(2)}h</span></div>
                    <div className="flex justify-between"><span className="text-red-600">OT×2.0</span><span>{totals.workOt2.toFixed(2)}h</span></div>
                  </div>
                  <div>
                    <div className="font-semibold">Drive</div>
                    <div className="flex justify-between"><span>Regular</span><span>{totals.driveReg.toFixed(2)}h</span></div>
                    <div className="flex justify-between"><span className="text-orange-600">OT×1.5</span><span>{totals.driveOt1.toFixed(2)}h</span></div>
                    <div className="flex justify-between"><span className="text-red-600">OT×2.0</span><span>{totals.driveOt2.toFixed(2)}h</span></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
