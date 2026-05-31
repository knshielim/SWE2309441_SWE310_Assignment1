import { useState, useEffect } from "react";
import { fetchTasks, deleteTask } from "../API/TaskAPI";
import { fetchProjects } from "../API/ProjectAPI";
import { fetchUsers } from "../API/UserAPI";
import TaskTable from "../components/TaskTable";
import TaskForm from "../components/TaskForm";
import FormModal from "../components/FormModal";
import TaskDetailModal from "../components/TaskDetailModal";
import { PageHeader, Panel, ENTITY_STYLE } from "../components/PageUI";

// Tasks page
function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchText, setSearchText] = useState("");
  const [filterProject, setFilterProject] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");
  const [filterAssignee, setFilterAssignee] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const [userData, projectData] = await Promise.all([fetchUsers(), fetchProjects()]);
        setUsers(userData);
        setProjects(projectData);
        await loadTasks(userData, projectData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (projects.length === 0 && users.length === 0) return;
    loadTasks(users, projects);
  }, [filterStatus, filterPriority, filterProject, searchText]);

  // Load tasks with filters
  const loadTasks = async (userList = users, projectList = projects) => {
    setLoading(true);
    try {
      const projectId =
        filterProject === "All"
          ? null
          : projectList.find((p) => p.name === filterProject)?.projectId;

      const taskData = await fetchTasks({
        status: filterStatus,
        priority: filterPriority,
        projectId,
        search: searchText,
      });

      const userMap = new Map(userList.map((u) => [u.userId, u.name]));
      const projectMap = new Map(projectList.map((p) => [p.projectId, p.name]));

      const dataWithNames = taskData.map((task) => ({
        ...task,
        projectName: projectMap.get(task.projectId) ?? null,
        assignedToName: task.assignedTo ? userMap.get(task.assignedTo) || null : null,
      }));

      setTasks(dataWithNames);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle task deletion
  const handleDelete = async (taskId) => {
    try {
      await deleteTask(taskId);
      setTasks(tasks.filter((t) => t.taskId !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("Failed to delete task.");
    }
  };

  // Handle task edit
  const handleEdit = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  // Handle task view
  const handleView = (task) => {
    setSelectedTask(task);
  };

  // Handle form success
  const handleFormSuccess = () => {
    loadTasks(users, projects);
    setEditingTask(null);
    setShowForm(false);
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingTask(null);
    setShowForm(false);
  };

  // Assignee filter stays on the client (API does not filter by assignee name)
  const filteredTasks = tasks.filter((t) =>
    filterAssignee === "All" ? true : t.assignedToName === filterAssignee
  );

  return (
    <div>
      <PageHeader
        icon="✅"
        title="Tasks"
        buttonLabel="Add New Task"
        onAdd={() => {
          setEditingTask(null);
          setShowForm(true);
        }}
      />

      <Panel>
        <p className="text-sm font-medium text-gray-600 mb-3">Filter by status</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {["All", "To Do", "In Progress", "Completed"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium border transition ${
                filterStatus === status
                  ? ENTITY_STYLE.filterActive
                  : ENTITY_STYLE.filterIdle
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <p className="text-sm font-medium text-gray-600 mb-3">Search &amp; filters</p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search task title..."
            className={`border bg-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 ${ENTITY_STYLE.inputFocus}`}
          />
          <select
            value={filterProject}
            onChange={(e) => setFilterProject(e.target.value)}
            className={`border bg-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 ${ENTITY_STYLE.inputFocus}`}
          >
            <option value="All">All Projects</option>
            {projects.map((project) => (
              <option key={project.projectId} value={project.name}>
                {project.name}
              </option>
            ))}
          </select>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className={`border bg-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 ${ENTITY_STYLE.inputFocus}`}
          >
            <option value="All">All Priorities</option>
            {["Low", "Medium", "High"].map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
          <select
            value={filterAssignee}
            onChange={(e) => setFilterAssignee(e.target.value)}
            className={`border bg-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 ${ENTITY_STYLE.inputFocus}`}
          >
            <option value="All">All Assignees</option>
            {users.map((user) => (
              <option key={user.userId} value={user.name}>
                {user.name}
              </option>
            ))}
          </select>
        </div>
      </Panel>

      {loading ? (
        <p className="text-center text-gray-500 py-6">Loading tasks...</p>
      ) : (
        <TaskTable
          tasks={filteredTasks}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onView={handleView}
        />
      )}

      {showForm && (
        <FormModal onClose={handleCancelEdit} maxWidth="max-w-2xl">
          <TaskForm
            editingTask={editingTask}
            onSuccess={handleFormSuccess}
            onCancelEdit={handleCancelEdit}
          />
        </FormModal>
      )}

      {selectedTask && (
        <TaskDetailModal task={selectedTask} onClose={() => setSelectedTask(null)} />
      )}
    </div>
  );
}

export default Tasks;
