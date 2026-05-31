import { ENTITY_STYLE, SUB_STYLE } from "./PageUI";

// Status color for tasks
const STATUS_COLOR = {
  "To Do": { backgroundColor: "#FFCDD2", color: "#B71C1C" },
  "In Progress": { backgroundColor: "#BBDEFB", color: "#0D47A1" },
  Completed: { backgroundColor: "#C8E6C9", color: "#1B5E20" },
};

// Priority color for tasks
const PRIORITY_COLOR = {
  Low: { backgroundColor: "#DCEDC8", color: "#33691E" },
  Medium: { backgroundColor: "#FFE0B2", color: "#E65100" },
  High: { backgroundColor: "#FFCDD2", color: "#B71C1C" },
};

// Table row for a single task
function TaskTableItem({ task, idx, onDelete, onEdit, onView }) {
  // Handle task deletion with confirmation
  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete task "${task.title}"?`)) {
      onDelete(task.taskId);
    }
  };

  // Check if task is past due
  const isPastDue =
    task.dueDate &&
    task.status !== "Completed" &&
    new Date(task.dueDate) < new Date(new Date().toDateString());

  return (
    <tr
      className={`${idx % 2 === 0 ? ENTITY_STYLE.rowEven : ENTITY_STYLE.rowOdd} ${ENTITY_STYLE.rowHover} transition-colors`}
    >
      <td className="py-2 px-4 text-gray-600">{task.taskId}</td>
      <td className="py-2 px-4 font-medium text-gray-800">{task.title}</td>
      <td className="py-1 px-4 whitespace-nowrap">
        <span
          className="px-2 py-0.5 rounded text-sm"
          style={STATUS_COLOR[task.status] ?? { backgroundColor: "#E0E0E0", color: "#333333" }}
        >
          {task.status}
        </span>
      </td>
      <td className="py-1 px-4">
        <span
          className="px-2 py-0.5 rounded text-sm"
          style={PRIORITY_COLOR[task.priority] ?? { backgroundColor: "#E0E0E0", color: "#333333" }}
        >
          {task.priority}
        </span>
      </td>
      <td className={`py-1 px-4 whitespace-nowrap ${isPastDue ? SUB_STYLE.textStrong : "text-gray-700"}`}>
        {task.dueDate ? task.dueDate.split("T")[0] : "—"}
      </td>
      <td className="py-2 px-4 text-gray-700">{task.projectName ?? "—"}</td>
      <td className="py-2 px-4 text-gray-700">{task.assignedToName ?? "Unassigned"}</td>
      <td className="py-2 px-4 text-center flex flex-col gap-2 items-center">
        <button
          onClick={() => onView(task)}
          className="bg-blue-100 text-blue-800 px-3 py-1 rounded hover:bg-blue-200 text-sm transition"
          style={{ width: 70 }}
        >
          View
        </button>
        <button
          onClick={() => onEdit(task)}
          className={`px-3 py-1 rounded text-sm transition ${ENTITY_STYLE.editBtn}`}
          style={{ width: 70 }}
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          className={`px-3 py-1 rounded text-sm transition ${SUB_STYLE.deleteBtn}`}
          style={{ width: 70 }}
        >
          Delete
        </button>
      </td>
    </tr>
  );
}

export default TaskTableItem;
