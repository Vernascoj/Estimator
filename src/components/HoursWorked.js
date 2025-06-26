import React, { useMemo } from 'react';
import { Trash2 } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

export default function HoursWorked({
  entries,
  onDelete,
  onReorder,
  overtimeEnabled,
  setOvertimeEnabled,
  hideControls = false
}) {
  // Compute OT
  const computed = useMemo(() => {
    let cum = 0;
    return entries.map(entry => {
      const dur = Number(entry.duration);
      const start = cum;
      const end = start + dur;
      const ot1 = overtimeEnabled ? Math.max(0, Math.min(end, 12) - Math.max(start, 8)) : 0;
      const ot2 = overtimeEnabled ? Math.max(0, end - Math.max(start, 12)) : 0;
      cum = end;
      return { ...entry, dur, ot1, ot2 };
    });
  }, [entries, overtimeEnabled]);

  const handleDragEnd = result => {
    if (!result.destination) return;
    const list = Array.from(entries);
    const [moved] = list.splice(result.source.index, 1);
    list.splice(result.destination.index, 0, moved);
    onReorder(list);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="hours">
        {provided => (
          <div ref={provided.innerRef} {...provided.droppableProps} className="overflow-x-auto">
            <table className="min-w-full table-fixed">
              <thead className="bg-gray-700">
                <tr>
                  <th className="w-2/6 px-6 py-3 text-left text-white">Class</th>
                  <th className="w-2/6 px-6 py-3 text-center text-white">Duration</th>
                  <th className="w-1/6 px-6 py-3 text-center text-white"></th>
                  <th className="w-1/6 px-6 py-3 text-right text-white"></th>
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
                        <td className="px-6 py-4 text-center">
                          <input
                            type="number"
                            value={entry.dur}
                            onChange={e => {
                              const u = [...entries];
                              u[idx].duration = Number(e.target.value);
                              onReorder(u);
                            }}
                            className="w-20 px-2 py-1 border rounded text-right"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col items-center space-y-1">
                            {entry.ot1 > 0 && <span className="whitespace-nowrap text-blue-600 text-sm">{entry.ot1.toFixed(2)} hr OT 1.5×</span>}
                            {entry.ot2 > 0 && <span className="whitespace-nowrap text-blue-800 text-sm">{entry.ot2.toFixed(2)} hr OT 2.0×</span>}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button onClick={() => onDelete(entry.id)} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
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
  );
}
