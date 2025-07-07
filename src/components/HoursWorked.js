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

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="hours-list">
        {(provided) => {
          let cumulative = 0;
          return (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="space-y-2"
            >
              {entries.map((e, index) => {
                const dur = e.duration;
                const prevCum = cumulative;
                cumulative += dur;

                // Calculate hours for reg, OT1, OT2
                let reg = 0, ot1 = 0, ot2 = 0;
                if (!overtimeEnabled) {
                  reg = dur;
                } else if (e.straightOT) {
                  ot1 = dur;
                } else {
                  const regHours = Math.min(dur, Math.max(0, 8 - prevCum));
                  let rem = dur - regHours;
                  const ot1Hours = Math.min(rem, Math.max(0, 4));
                  rem -= ot1Hours;
                  const ot2Hours = rem;
                  reg = regHours;
                  ot1 = ot1Hours;
                  ot2 = ot2Hours;
                }

                return (
                  <Draggable key={e.id} draggableId={e.id} index={index}>
                    {(prov) => (
                      <div
                        ref={prov.innerRef}
                        {...prov.dragHandleProps}
                        className="relative flex justify-between items-center bg-white p-2 rounded shadow h-12"
                      >
                        {/* Type selector */}
                        <select
                          value={e.type}
                          onChange={ev => onUpdateEntry(e.id, { type: ev.target.value })}
                          className="border rounded p-1 bg-gray-100"
                        >
                          <option value="Work">Work</option>
                          <option value="Drive">Drive</option>
                        </select>

                        {/* Duration controls */}
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => onUpdateEntry(e.id, { duration: Math.max(0, dur - 1) })}
                            className="px-2 py-1 bg-gray-200 rounded"
                          >
                            –
                          </button>
                          <input
                            type="number"
                            onFocus={ev => ev.target.select()}
                            value={dur}
                            onChange={ev => onUpdateEntry(e.id, { duration: Math.max(0, Number(ev.target.value)) })}
                            className="w-16 text-center text-black border rounded"
                          />
                          <button
                            onClick={() => onUpdateEntry(e.id, { duration: dur + 1 })}
                            className="px-2 py-1 bg-gray-200 rounded"
                          >
                            +
                          </button>
                          <span className="ml-2 text-black font-medium">HR</span>
                        </div>

                        {/* OT labels, hidden on mobile */}
                        <div
                          className="hidden md:flex absolute right-44 top-1/2 -translate-y-1/2 text-xs text-red-600 flex flex-col items-end"
                        >
                          {ot1 > 0 && <span>+{ot1} OT @ 1.5×</span>}
                          {ot2 > 0 && <span>+{ot2} OT @ 2.0×</span>}
                        </div>

                        {/* As OT toggle, moved right */}
                        <div
                          className="absolute right-2 sm:right-6 lg:right-20 top-1/2 -translate-y-1/2 flex items-center space-x-1"
                        >
                          <input
                            type="checkbox"
                            checked={e.straightOT || false}
                            onChange={() => onUpdateEntry(e.id, { straightOT: !e.straightOT })}
                          />
                          <span className="text-sm">As OT</span>
                        </div>

                        {/* Delete button */}
                        <button
                          onClick={() => onDelete(e.id)}
                          className="p-1 ml-2 sm:ml-4 hover:bg-gray-100 rounded"
                        >
                          <Trash2 className="h-5 w-5 text-red-500" />
                        </button>
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          );
        }}
      </Droppable>
    </DragDropContext>
  );
}