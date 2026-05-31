import { ENTITY_STYLE, SUB_STYLE } from "./PageUI";

// Status color for projects
const PROJECT_STATUS_COLOR = {
  "Not Started": { backgroundColor: "#FFCDD2", color: "#B71C1C" },
  "In Progress": { backgroundColor: "#BBDEFB", color: "#0D47A1" },
  Completed: { backgroundColor: "#C8E6C9", color: "#1B5E20" },
};

// Table row for a single project
function ProjectTableItem({ project, idx, onDelete, onEdit, onViewUpdates }) {
  // Handle project deletion with confirmation
  const handleDelete = () => {
    if (
      window.confirm(
        `Are you sure you want to delete project "${project.name}"? This will also delete all its tasks.`
      )
    ) {
      onDelete(project.projectId);
    }
  };

  return (
    <tr
      className={`${idx % 2 === 0 ? ENTITY_STYLE.rowEven : ENTITY_STYLE.rowOdd} ${ENTITY_STYLE.rowHover} transition-colors`}
    >
      <td className="py-2 px-4 text-gray-600">{project.projectId}</td>
      <td className="py-2 px-4 font-medium text-gray-800">{project.name}</td>
      <td className="py-2 px-4 text-gray-600 max-w-xs">
        {project.description || "—"}
      </td>
      <td className="py-2 px-4 min-w-40">
        <div className="text-sm text-gray-600 mb-1">
          {project.completedTasks ?? 0}/{project.totalTasks ?? 0} done
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full">
          <div
            className="h-full bg-blue-300 rounded-full"
            style={{ width: `${project.progressPercent ?? 0}%` }}
          />
        </div>
      </td>
      <td className="py-1 px-4 whitespace-nowrap">
        <span
          className="px-2 py-0.5 rounded text-sm"
          style={PROJECT_STATUS_COLOR[project.projectStatus] ?? { backgroundColor: "#E0E0E0", color: "#333333" }}
        >
          {project.projectStatus ?? "Not Started"}
        </span>
      </td>
      <td className="py-2 px-4">
        <span className={`px-2 py-0.5 rounded text-sm ${SUB_STYLE.badge}`}>
          {project.ownerName ?? "Unassigned"}
        </span>
      </td>
      <td className="py-1 px-4 text-gray-600 whitespace-nowrap">{project.createdAt?.split("T")[0]}</td>
      <td className="py-2 px-4 text-center flex flex-col gap-2 items-center">
        <button
          onClick={() => onViewUpdates(project)}
          className="bg-blue-100 text-blue-800 px-3 py-1 rounded hover:bg-blue-200 text-sm transition"
          style={{ width: 70 }}
        >
          Update
        </button>
        <button
          onClick={() => onEdit(project)}
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

export default ProjectTableItem;
