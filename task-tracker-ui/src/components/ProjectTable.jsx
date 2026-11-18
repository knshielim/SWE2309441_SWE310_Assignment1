import ProjectTableItem from "./ProjectTableItem";
import { DataTable, EmptyState } from "./PageUI";

const COLUMNS = [
  { label: "Project", className: "min-w-64" },
  { label: "Progress", className: "min-w-44" },
  { label: "Status" },
  { label: "PIC", className: "min-w-44" },
  { label: "Created" },
  { label: "Actions", align: "right" },
];

// Table to display list of projects
function ProjectTable({ projects, onDelete, onEdit, onViewUpdates, emptyAction }) {
  if (projects.length === 0) {
    return (
      <EmptyState
        icon="folder"
        title="No projects found"
        message="Try a different search, or create a new project to get started."
        action={emptyAction}
      />
    );
  }

  return (
    <DataTable columns={COLUMNS}>
      {projects.map((project) => (
        <ProjectTableItem
          key={project.projectId}
          project={project}
          onDelete={onDelete}
          onEdit={onEdit}
          onViewUpdates={onViewUpdates}
        />
      ))}
    </DataTable>
  );
}

export default ProjectTable;
