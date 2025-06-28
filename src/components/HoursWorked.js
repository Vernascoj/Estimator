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
                      className="relative flex justify-between items-center bg-white p-2 rounded shadow h-12"
                    >
                      <select
                        value={e.type}
                        onChange={ev => onUpdateEntry(e.id, { type: ev.target.value })}
                        className="border rounded p-1 bg-gray-100"
                      >
                        <option value="Work">Work</option>
                        <option value="Drive">Drive</option>
                      </select>

                                            <div className="flex items-center space-x-1">
                        <button
                          onClick={() => onUpdateEntry(e.id, { duration: Math.max(0, dur - 1) })}
                          className="px-2 py-1 bg-gray-200 rounded"
                        >
                          –
                        </button>
                        <input
    type="number"
              onFocus={e => e.target.select()}
                          value={dur}
                          onChange={ev => onUpdateEntry(e.id, { duration: Math.max(0, Number(ev.target.value)) })}
                          className="w-16 text-center text-black border rounded"
                        
    className="border p-1 rounded text-center w-16"
/>
                        <button
                          onClick={() => onUpdateEntry(e.id, { duration: dur + 1 })}
                          className="px-2 py-1 bg-gray-200 rounded"
                        >
                          +
                        </button>
                        <span className="ml-2 text-black font-medium">HR</span>
                      </div>

                      <div className="hidden sm:flex absolute right-20 top-1/2 transform -translate-y-1/2 flex-col items-start text-sm text-red-600 space-y-1">
                        {ot1 > 0 && <span>+{ot1} hr @ 1.5× OT</span>}
                        {ot2 > 0 && <span>+{ot2} hr @ 2.0× OT</span>}
                      </div>

                      <button onClick={() => onDelete(e.id)} className="p-1 ml-2 sm:ml-4 hover:bg-gray-100 rounded">
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
