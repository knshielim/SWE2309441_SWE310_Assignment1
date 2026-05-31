import TaskTableItem from "./TaskTableItem";
import { ENTITY_STYLE } from "./PageUI";

// Table to display list of tasks
function TaskTable({ tasks, onDelete, onEdit, onView }) {
  if (tasks.length === 0) {
    return <p className={`text-center py-6 ${ENTITY_STYLE.empty}`}>No tasks found.</p>;
  }

  return (
    <div className={`overflow-x-auto rounded-lg border bg-white ${ENTITY_STYLE.tableWrap}`}>
      <table className="min-w-full">
        <thead>
          <tr className={ENTITY_STYLE.tableHead}>
            <th className="py-3 px-4 text-left font-semibold">ID</th>
            <th className="py-3 px-4 text-left font-semibold">Title</th>
            <th className="py-3 px-4 text-left font-semibold">Status</th>
            <th className="py-3 px-4 text-left font-semibold">Priority</th>
            <th className="py-3 px-4 text-left font-semibold">Due Date</th>
            <th className="py-3 px-4 text-left font-semibold min-w-32">Project</th>
            <th className="py-3 px-4 text-left font-semibold">Assigned To</th>
            <th className="py-3 px-4 text-center font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task, idx) => (
            <TaskTableItem
              key={task.taskId}
              task={task}
              idx={idx}
              onDelete={onDelete}
              onEdit={onEdit}
              onView={onView}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TaskTable;
