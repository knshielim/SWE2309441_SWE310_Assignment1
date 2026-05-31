import { useState, useEffect } from "react";
import { addTask, editTask } from "../API/TaskAPI";
import { fetchProjects } from "../API/ProjectAPI";
import { fetchUsers } from "../API/UserAPI";

// Form for creating and editing tasks
function TaskForm({ editingTask, onSuccess, onCancelEdit }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "To Do",
    priority: "Medium",
    dueDate: "",
    projectId: "",
    assignedTo: "",
  });
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  // Load projects and users for dropdowns
  useEffect(() => {
    const loadDropdowns = async () => {
      try {
        const [projectData, userData] = await Promise.all([
          fetchProjects(),
          fetchUsers(),
        ]);
        setProjects(projectData);
        setUsers(userData);
      } catch (error) {
        console.error("Error loading dropdowns:", error);
      }
    };
    loadDropdowns();
  }, []);

  useEffect(() => {
    if (editingTask) {
      setForm({
        title: editingTask.title,
        description: editingTask.description || "",
        status: editingTask.status,
        priority: editingTask.priority,
        dueDate: editingTask.dueDate ? editingTask.dueDate.split("T")[0] : "",
        projectId: editingTask.projectId.toString(),
        assignedTo: editingTask.assignedTo?.toString() ?? "",
      });
      setMessage("");
      setErrors({});
    }
  }, [editingTask]);

  // Handle input changes and clear errors
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  // Validate form inputs
  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = "Task title is required.";
    else if (form.title.length > 200)
      newErrors.title = "Title cannot exceed 200 characters.";
    if (!form.projectId) newErrors.projectId = "Please select a project.";
    return newErrors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const payload = {
      title: form.title,
      description: form.description || null,
      status: form.status,
      priority: form.priority,
      dueDate: form.dueDate || null,
      projectId: parseInt(form.projectId),
      assignedTo: form.assignedTo ? parseInt(form.assignedTo) : null,
    };

    try {
      if (editingTask) {
        await editTask(editingTask.taskId, payload);
        setMessage("Task updated successfully!");
      } else {
        await addTask(payload);
        setMessage("Task added successfully!");
        setForm({
          title: "",
          description: "",
          status: "To Do",
          priority: "Medium",
          dueDate: "",
          projectId: "",
          assignedTo: "",
        });
      }
      onSuccess();
    } catch (error) {
      setMessage("Operation failed. Please try again.");
    }
  };

  // Handle cancel edit
  const handleCancel = () => {
    setForm({
      title: "",
      description: "",
      status: "To Do",
      priority: "Medium",
      dueDate: "",
      projectId: "",
      assignedTo: "",
    });
    setErrors({});
    setMessage("");
    onCancelEdit();
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6 w-full max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
        {editingTask ? "Edit Task" : "Add New Task"}
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Task Title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 border-gray-300"
            placeholder="e.g. Design homepage layout"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">
            Description <span className="text-gray-400">(optional)</span>
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={2}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 border-gray-300"
            placeholder="Task details..."
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Project</label>
          <select
            name="projectId"
            value={form.projectId}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 border-gray-300"
          >
            <option value="">-- Select a Project --</option>
            {projects.map((p) => (
              <option key={p.projectId} value={p.projectId}>
                {p.name}
              </option>
            ))}
          </select>
          {errors.projectId && (
            <p className="text-red-500 text-sm mt-1">{errors.projectId}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">
            Assign To <span className="text-gray-400">(optional)</span>
          </label>
          <select
            name="assignedTo"
            value={form.assignedTo}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 border-gray-300"
          >
            <option value="">-- Unassigned --</option>
            {users.map((u) => (
              <option key={u.userId} value={u.userId}>
                {u.name} ({u.role})
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4 flex gap-4">
          <div className="flex-1">
            <label className="block mb-1 font-medium">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 border-gray-300"
            >
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block mb-1 font-medium">Priority</label>
            <select
              name="priority"
              value={form.priority}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 border-gray-300"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>

        <div className="mb-6">
          <label className="block mb-1 font-medium">
            Due Date <span className="text-gray-400">(optional)</span>
          </label>
          <input
            name="dueDate"
            type="date"
            value={form.dueDate}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 border-gray-300"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="flex-1 bg-blue-200 text-blue-800 py-2 rounded-lg hover:bg-blue-300 font-semibold shadow-sm hover:shadow transition"
          >
            {editingTask ? "Save Changes" : "Add Task"}
          </button>
          {editingTask && (
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 bg-pink-100 text-pink-800 py-2 rounded-lg hover:bg-pink-200 font-semibold border border-pink-200"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {message && (
        <div
          className={`mt-4 text-center font-medium ${
            message.includes("failed") ? "text-red-600" : "text-green-600"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
}

export default TaskForm;
