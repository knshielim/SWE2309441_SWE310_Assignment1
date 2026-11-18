import TaskTableItem from "./TaskTableItem";
import { DataTable, EmptyState } from "./PageUI";

const COLUMNS = [
  { label: "Task", className: "min-w-64" },
  { label: "Status" },
  { label: "Priority" },
  { label: "Due Date" },
  { label: "Project", className: "min-w-36" },
  { label: "Assignee", className: "min-w-44" },
  { label: "Actions", align: "right" },
];

// Table to display list of tasks
function TaskTable({ tasks, onDelete, onEdit, onView, emptyAction }) {
  if (tasks.length === 0) {
    return (
      <EmptyState
        icon="check"
        title="No tasks found"
        message="No tasks match the current filters. Adjust them or add a new task."
        action={emptyAction}
      />
    );
  }

  return (
    <DataTable columns={COLUMNS}>
      {tasks.map((task) => (
        <TaskTableItem
          key={task.taskId}
          task={task}
          onDelete={onDelete}
          onEdit={onEdit}
          onView={onView}
        />
      ))}
    </DataTable>
  );
}

export default TaskTable;
