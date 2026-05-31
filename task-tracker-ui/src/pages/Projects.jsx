import { useState, useEffect } from "react";
import { fetchProjects, deleteProject } from "../API/ProjectAPI";
import { fetchTasks } from "../API/TaskAPI";
import { fetchUsers } from "../API/UserAPI";
import ProjectTable from "../components/ProjectTable";
import ProjectForm from "../components/ProjectForm";
import ProjectDetailModal from "../components/ProjectDetailModal";
import FormModal from "../components/FormModal";
import { PageHeader, Panel } from "../components/PageUI";
import SearchBar from "../components/SearchBar";

// Projects page
function Projects() {
  const [projects, setProjects] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [editingProject, setEditingProject] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  // Fetch data and calculate progress
  const fetchData = async () => {
    try {
      const [projectData, taskData, userData] = await Promise.all([
        fetchProjects(),
        fetchTasks(),
        fetchUsers(),
      ]);
      const userMap = new Map(userData.map((u) => [u.userId, u.name]));
      const data = projectData.map((project) => {
        const projectTasks = taskData.filter((t) => t.projectId === project.projectId);
        const totalTasks = projectTasks.length;
        const completedTasks = projectTasks.filter((t) => t.status === "Completed").length;
        const progressPercent =
          totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

        let projectStatus = project.status || "Not Started";

        let ownerName = project.ownerName;
        if (!ownerName && project.ownerId) {
          ownerName = userMap.get(project.ownerId) ?? "Unassigned";
        }
        if (!ownerName) {
          const ownerCounts = {};
          projectTasks.forEach((t) => {
            if (t.assignedTo) {
              ownerCounts[t.assignedTo] = (ownerCounts[t.assignedTo] || 0) + 1;
            }
          });
          const topOwnerId = Object.keys(ownerCounts).sort(
            (a, b) => ownerCounts[b] - ownerCounts[a]
          )[0];
          ownerName = topOwnerId ? userMap.get(Number(topOwnerId)) ?? "Unassigned" : "Unassigned";
        }

        return {
          ...project,
          totalTasks,
          completedTasks,
          progressPercent,
          projectStatus: projectStatus,
          ownerName: ownerName ?? "Unassigned",
        };
      });
      const sorted = [...data].sort((a, b) => a.projectId - b.projectId);
      setProjects(sorted);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle project deletion
  const handleDelete = async (projectId) => {
    try {
      await deleteProject(projectId);
      setProjects(projects.filter((p) => p.projectId !== projectId));
    } catch (error) {
      console.error("Error deleting project:", error);
      alert("Failed to delete project.");
    }
  };

  // Handle project edit
  const handleEdit = (project) => {
    setEditingProject(project);
    setShowForm(true);
  };

  // Handle form success
  const handleFormSuccess = () => {
    fetchData();
    setEditingProject(null);
    setShowForm(false);
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingProject(null);
    setShowForm(false);
  };

  // Handle view updates
  const handleViewUpdates = (project) => {
    setSelectedProject(project);
  };

  const filteredProjects = projects.filter((p) => {
    if (!searchText.trim()) return true;
    const term = searchText.trim().toLowerCase();
    return (
      p.name.toLowerCase().includes(term) ||
      (p.description ?? "").toLowerCase().includes(term)
    );
  });

  return (
    <div>
      <PageHeader
        icon="📁"
        title="Projects"
        buttonLabel="Add New Project"
        onAdd={() => {
          setEditingProject(null);
          setShowForm(true);
        }}
      />

      <Panel>
        <p className="text-sm font-medium text-gray-600 mb-2">Search projects</p>
        <SearchBar
          value={searchText}
          onChange={setSearchText}
          placeholder="Search by name or description..."
        />
      </Panel>

      {loading ? (
        <p className="text-center text-gray-500 py-6">Loading projects...</p>
      ) : (
        <ProjectTable
          projects={filteredProjects}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onViewUpdates={handleViewUpdates}
        />
      )}

      {showForm && (
        <FormModal onClose={handleCancelEdit}>
          <ProjectForm
            editingProject={editingProject}
            onSuccess={handleFormSuccess}
            onCancelEdit={handleCancelEdit}
          />
        </FormModal>
      )}

      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  );
}

export default Projects;
