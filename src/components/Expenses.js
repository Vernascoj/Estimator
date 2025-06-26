import React from 'react';
import { Trash2 } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

export default function Expenses({
  expenseItems,
  onAddExpense,
  onUpdateExpense,
  onDeleteExpense,
  onReorderExpenses
}) {
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = Array.from(expenseItems);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    onReorderExpenses(reordered);
  };

  return (
    <>
      {expenseItems.length === 0 ? (
        <p className="text-gray-300">No additional expenses.</p>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="expenses">
            {provided => (
              <table
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="min-w-full table-auto bg-white dark:bg-gray-800 shadow rounded-lg"
              >
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-4 py-2 text-left text-white">Description</th>
                    <th className="px-4 py-2 text-right text-white">Cost</th>
                    <th className="px-4 py-2 text-center text-white">Profit?</th>
                    <th className="px-4 py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {expenseItems.map((item, idx) => (
                    <Draggable key={item.id} draggableId={item.id} index={idx}>
                      {prov => (
                        <tr
                          ref={prov.innerRef}
                          {...prov.draggableProps}
                          {...prov.dragHandleProps}
                          className="even:bg-gray-50 odd:bg-white dark:even:bg-gray-900 dark:odd:bg-gray-800"
                        >
                          <td className="px-4 py-2">
                            <input
                              type="text"
                              value={item.description}
                              onChange={e => onUpdateExpense(item.id, { description: e.target.value })}
                              className="w-full px-2 py-1 border rounded"
                            />
                          </td>
                          <td className="px-4 py-2 text-right">
                            <input
                              type="number"
                              value={item.cost}
                              onChange={e => onUpdateExpense(item.id, { cost: Number(e.target.value) })}
                              className="w-24 px-2 py-1 border rounded text-right"
                            />
                          </td>
                          <td className="px-4 py-2 text-center">
                            <input
                              type="checkbox"
                              checked={item.profitable}
                              onChange={e => onUpdateExpense(item.id, { profitable: e.target.checked })}
                              className="h-4 w-4"
                            />
                          </td>
                          <td className="px-4 py-2 text-right">
                            <button
                              onClick={() => onDeleteExpense(item.id)}
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
            )}
          </Droppable>
        </DragDropContext>
      )}
    </>
  );
}
