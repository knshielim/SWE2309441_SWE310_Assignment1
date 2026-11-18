import { useState, useEffect } from "react";
import { fetchTasks, deleteTask } from "../API/TaskAPI";
import { fetchProjects } from "../API/ProjectAPI";
import { fetchUsers } from "../API/UserAPI";
import TaskTable from "../components/TaskTable";
import TaskForm from "../components/TaskForm";
import FormModal from "../components/FormModal";
import TaskDetailModal from "../components/TaskDetailModal";
import { Button, LoadingState, PageHeader, Panel, inputClass } from "../components/PageUI";
import SearchBar from "../components/SearchBar";
import FilterChips from "../components/FilterChips";
import Icon from "../components/Icons";

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
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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

  // Wait for the user to stop typing before hitting the API
  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(searchText), 300);
    return () => clearTimeout(id);
  }, [searchText]);

  useEffect(() => {
    if (projects.length === 0 && users.length === 0) return;
    loadTasks(users, projects);
  }, [filterStatus, filterPriority, filterProject, debouncedSearch]);

  // Load tasks with filters
  const loadTasks = async (userList = users, projectList = projects) => {
    setRefreshing(true);
    try {
      const projectId =
        filterProject === "All"
          ? null
          : projectList.find((p) => p.name === filterProject)?.projectId;

      const taskData = await fetchTasks({
        status: filterStatus,
        priority: filterPriority,
        projectId,
        search: debouncedSearch,
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
      setRefreshing(false);
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

  const openCreateForm = () => {
    setEditingTask(null);
    setShowForm(true);
  };

  // Assignee filter stays on the client (API does not filter by assignee name)
  const filteredTasks = tasks.filter((t) =>
    filterAssignee === "All" ? true : t.assignedToName === filterAssignee
  );

  const hasFilters =
    filterStatus !== "All" ||
    filterProject !== "All" ||
    filterPriority !== "All" ||
    filterAssignee !== "All" ||
    searchText.trim() !== "";

  const clearFilters = () => {
    setFilterStatus("All");
    setFilterProject("All");
    setFilterPriority("All");
    setFilterAssignee("All");
    setSearchText("");
  };

  const selectClass = `${inputClass()} md:w-auto md:min-w-40`;

  return (
    <div>
      <PageHeader
        icon="check"
        title="Tasks"
        subtitle={
          loading
            ? "Loading tasks..."
            : `Showing ${filteredTasks.length} task${filteredTasks.length === 1 ? "" : "s"}${hasFilters ? " (filtered)" : ""}`
        }
        buttonLabel="New task"
        onAdd={openCreateForm}
      />

      <Panel className="space-y-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <FilterChips
            options={["All", "To Do", "In Progress", "Completed"]}
            value={filterStatus}
            onChange={setFilterStatus}
          />
          <SearchBar
            value={searchText}
            onChange={setSearchText}
            placeholder="Search task title..."
            className="lg:w-72"
          />
        </div>
        <div className="flex flex-col gap-2 md:flex-row md:flex-wrap md:items-center">
          <span className="hidden items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400 md:inline-flex">
            <Icon name="list" className="h-3.5 w-3.5" /> Filters
          </span>
          <select
            value={filterProject}
            onChange={(e) => setFilterProject(e.target.value)}
            className={selectClass}
            aria-label="Filter by project"
          >
            <option value="All">All projects</option>
            {projects.map((project) => (
              <option key={project.projectId} value={project.name}>
                {project.name}
              </option>
            ))}
          </select>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className={selectClass}
            aria-label="Filter by priority"
          >
            <option value="All">All priorities</option>
            {["Low", "Medium", "High"].map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
          <select
            value={filterAssignee}
            onChange={(e) => setFilterAssignee(e.target.value)}
            className={selectClass}
            aria-label="Filter by assignee"
          >
            <option value="All">All assignees</option>
            {users.map((user) => (
              <option key={user.userId} value={user.name}>
                {user.name}
              </option>
            ))}
          </select>
          {hasFilters && (
            <Button variant="ghost" size="sm" icon="x" onClick={clearFilters}>
              Clear filters
            </Button>
          )}
          {refreshing && !loading && (
            <Icon name="loader" className="ml-auto h-4 w-4 animate-spin text-blue-500" />
          )}
        </div>
      </Panel>

      {loading ? (
        <LoadingState label="Loading tasks..." />
      ) : (
        <div className={`transition-opacity ${refreshing ? "opacity-60" : ""}`}>
          <TaskTable
            tasks={filteredTasks}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onView={handleView}
            emptyAction={
              hasFilters ? (
                <Button variant="secondary" icon="x" onClick={clearFilters}>
                  Clear filters
                </Button>
              ) : (
                <Button variant="secondary" icon="plus" onClick={openCreateForm}>
                  New task
                </Button>
              )
            }
          />
        </div>
      )}

      {showForm && (
        <FormModal
          onClose={handleCancelEdit}
          maxWidth="max-w-2xl"
          title={editingTask ? "Edit task" : "New task"}
          subtitle={editingTask ? editingTask.title : "Add a task and assign it to a project."}
        >
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
