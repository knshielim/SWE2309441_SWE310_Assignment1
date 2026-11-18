import Icon from "./Icons";
import { IconButton, Person, StatusBadge, daysUntil, formatDate, relativeDue } from "./PageUI";

// Table row for a single task
function TaskTableItem({ task, onDelete, onEdit, onView }) {
  // Handle task deletion with confirmation
  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete task "${task.title}"?`)) {
      onDelete(task.taskId);
    }
  };

  const isCompleted = task.status === "Completed";
  const days = daysUntil(task.dueDate);
  const isPastDue = days !== null && days < 0 && !isCompleted;
  const isDueSoon = days !== null && days >= 0 && days <= 2 && !isCompleted;

  return (
    <tr className="transition-colors hover:bg-slate-50/80">
      <td className="px-4 py-3.5">
        <button
          type="button"
          onClick={() => onView(task)}
          className={`text-left text-sm font-semibold hover:text-blue-700 ${
            isCompleted ? "text-slate-500 line-through decoration-slate-300" : "text-slate-900"
          }`}
        >
          {task.title}
        </button>
        {task.description && (
          <p className="mt-0.5 line-clamp-1 max-w-sm text-xs text-slate-500" title={task.description}>
            {task.description}
          </p>
        )}
      </td>
      <td className="px-4 py-3.5">
        <StatusBadge value={task.status} />
      </td>
      <td className="px-4 py-3.5">
        <StatusBadge value={task.priority} kind="priority" />
      </td>
      <td className="whitespace-nowrap px-4 py-3.5 text-sm">
        {task.dueDate ? (
          <div>
            <p className={isPastDue ? "font-semibold text-rose-600" : "text-slate-700"}>
              {formatDate(task.dueDate)}
            </p>
            {!isCompleted && (
              <p
                className={`mt-0.5 flex items-center gap-1 text-xs ${
                  isPastDue ? "text-rose-500" : isDueSoon ? "text-amber-600" : "text-slate-400"
                }`}
              >
                {(isPastDue || isDueSoon) && <Icon name="clock" className="h-3 w-3" />}
                {relativeDue(task.dueDate)}
              </p>
            )}
          </div>
        ) : (
          <span className="text-slate-400">—</span>
        )}
      </td>
      <td className="px-4 py-3.5 text-sm text-slate-700">
        {task.projectName ? (
          <span className="inline-flex items-center gap-1.5">
            <Icon name="folder" className="h-3.5 w-3.5 text-slate-400" />
            {task.projectName}
          </span>
        ) : (
          <span className="text-slate-400">—</span>
        )}
      </td>
      <td className="px-4 py-3.5">
        <Person name={task.assignedToName} />
      </td>
      <td className="px-4 py-3.5">
        <div className="flex justify-end gap-1">
          <IconButton icon="eye" label="View task" tone="primary" onClick={() => onView(task)} />
          <IconButton icon="edit" label="Edit task" tone="primary" onClick={() => onEdit(task)} />
          <IconButton icon="trash" label="Delete task" tone="danger" onClick={handleDelete} />
        </div>
      </td>
    </tr>
  );
}

export default TaskTableItem;
