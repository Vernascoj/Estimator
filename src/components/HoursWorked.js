import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Trash2 } from 'lucide-react';

export default function HoursWorked({ entries, onDelete, onUpdateEntry, onReorder, overtimeEnabled }) {
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const newEntries = Array.from(entries);
    const [moved] = newEntries.splice(result.source.index, 1);
    newEntries.splice(result.destination.index, 0, moved);
    onReorder(newEntries);
  };

  let cumulative = 0;
  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="hours-list">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-2">
            {entries.map((e, index) => {
              const dur = e.duration;
              let rem = dur;
              const reg = overtimeEnabled ? Math.min(rem, Math.max(0, 8 - cumulative)) : dur;
              rem -= reg;
              const ot1 = overtimeEnabled ? Math.min(rem, Math.max(0, 12 - (cumulative + reg))) : 0;
              rem -= ot1;
              const ot2 = overtimeEnabled ? rem : 0;
              cumulative += dur;

              return (
                <Draggable key={e.id} draggableId={e.id} index={index}>
                  {(prov) => (
                    <div
                      ref={prov.innerRef}
                      {...prov.draggableProps}
                      {...prov.dragHandleProps}
                      className="flex justify-between items-center bg-white p-2 rounded shadow"
                    >
                      {/* Hour Type Selector */}
                      <select
                        value={e.type}
                        onChange={ev => onUpdateEntry(e.id, { type: ev.target.value })}
                        className="border rounded p-1 bg-gray-100"
                      >
                        <option value="Work">Work</option>
                        <option value="Drive">Drive</option>
                      </select>

                      {/* Duration Input */}
                      <div className="flex items-center">
                        <input
                          type="number"
                          value={dur}
                          onChange={ev => onUpdateEntry(e.id, { duration: Math.max(0, Number(ev.target.value)) })}
                          className="w-16 text-center text-black border rounded"
                        />
                        <span className="ml-2 text-black font-medium">HR</span>
                      </div>

                      {/* Overtime Display */}
                      <div className="flex flex-col items-start text-sm text-red-600 mr-4 space-y-1">
                        {ot1 > 0 && <span>{ot1} hr @ 1.5× OT</span>}
                        {ot2 > 0 && <span>{ot2} hr @ 2.0× OT</span>}
                      </div>

                      {/* Delete Button */}
                      <button onClick={() => onDelete(e.id)} className="p-1 hover:bg-gray-100 rounded">
                        <Trash2 className="h-5 w-5 text-red-500" />
                      </button>
                    </div>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
