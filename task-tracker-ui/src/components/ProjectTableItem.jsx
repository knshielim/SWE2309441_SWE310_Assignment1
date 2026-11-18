import { IconButton, Person, ProgressBar, StatusBadge, formatDate } from "./PageUI";

// Table row for a single project
function ProjectTableItem({ project, onDelete, onEdit, onViewUpdates }) {
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

  const percent = project.progressPercent ?? 0;
  const owner = project.ownerName && project.ownerName !== "Unassigned" ? project.ownerName : null;

  return (
    <tr className="group transition-colors hover:bg-slate-50/80">
      <td className="px-4 py-3.5">
        <button
          type="button"
          onClick={() => onViewUpdates(project)}
          className="text-left text-sm font-semibold text-slate-900 hover:text-blue-700"
        >
          {project.name}
        </button>
        <p className="mt-0.5 line-clamp-1 max-w-sm text-xs text-slate-500" title={project.description}>
          {project.description || <span className="italic text-slate-400">No description</span>}
        </p>
      </td>
      <td className="px-4 py-3.5">
        <div className="mb-1.5 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            {project.completedTasks ?? 0}/{project.totalTasks ?? 0} tasks
          </span>
          <span className="font-semibold text-slate-700">{percent}%</span>
        </div>
        <ProgressBar percent={percent} />
      </td>
      <td className="px-4 py-3.5">
        <StatusBadge value={project.projectStatus ?? "Not Started"} />
      </td>
      <td className="px-4 py-3.5">
        <Person name={owner} />
      </td>
      <td className="whitespace-nowrap px-4 py-3.5 text-sm text-slate-500">
        {formatDate(project.createdAt)}
      </td>
      <td className="px-4 py-3.5">
        <div className="flex justify-end gap-1">
          <IconButton icon="message" label="Project updates" tone="primary" onClick={() => onViewUpdates(project)} />
          <IconButton icon="edit" label="Edit project" tone="primary" onClick={() => onEdit(project)} />
          <IconButton icon="trash" label="Delete project" tone="danger" onClick={handleDelete} />
        </div>
      </td>
    </tr>
  );
}

export default ProjectTableItem;
