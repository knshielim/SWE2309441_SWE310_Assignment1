import ProjectTableItem from "./ProjectTableItem";
import { ENTITY_STYLE } from "./PageUI";

// Table to display list of projects
function ProjectTable({ projects, onDelete, onEdit, onViewUpdates }) {
  if (projects.length === 0) {
    return <p className={`text-center py-6 ${ENTITY_STYLE.empty}`}>No projects found.</p>;
  }

  return (
    <div className={`overflow-x-auto rounded-lg border bg-white ${ENTITY_STYLE.tableWrap}`}>
      <table className="min-w-full">
        <thead>
          <tr className={ENTITY_STYLE.tableHead}>
            <th className="py-3 px-4 text-left font-semibold">ID</th>
            <th className="py-3 px-4 text-left font-semibold min-w-56">Name</th>
            <th className="py-3 px-4 text-left font-semibold max-w-48">Description</th>
            <th className="py-3 px-4 text-left font-semibold">Progress</th>
            <th className="py-3 px-4 text-left font-semibold">Status</th>
            <th className="py-3 px-4 text-left font-semibold">PIC</th>
            <th className="py-3 px-4 text-left font-semibold">Created</th>
            <th className="py-3 px-4 text-center font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project, idx) => (
            <ProjectTableItem
              key={project.projectId}
              project={project}
              idx={idx}
              onDelete={onDelete}
              onEdit={onEdit}
              onViewUpdates={onViewUpdates}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProjectTable;
