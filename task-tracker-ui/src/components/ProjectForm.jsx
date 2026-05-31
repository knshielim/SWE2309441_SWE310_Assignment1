import { useState, useEffect } from "react";
import { addProject, editProject } from "../API/ProjectAPI";
import { fetchUsers } from "../API/UserAPI";

// Form for creating and editing projects
function ProjectForm({ editingProject, onSuccess, onCancelEdit }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    ownerId: "",
    status: "Not Started",
  });
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchUsers().then(setUsers).catch(console.error);
  }, []);

  useEffect(() => {
    if (editingProject) {
      setForm({
        name: editingProject.name,
        description: editingProject.description || "",
        ownerId: editingProject.ownerId || "",
        status: editingProject.status || "Not Started",
      });
      setMessage("");
      setErrors({});
    }
  }, [editingProject]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  // Validate form inputs
  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Project name is required.";
    else if (form.name.length > 150)
      newErrors.name = "Name cannot exceed 150 characters.";
    if (form.description.length > 500)
      newErrors.description = "Description cannot exceed 500 characters.";
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

    try {
      if (editingProject) {
        await editProject(editingProject.projectId, form);
        setMessage("Project updated successfully!");
      } else {
        await addProject(form);
        setMessage("Project added successfully!");
        setForm({ name: "", description: "" });
      }
      onSuccess();
    } catch (error) {
      setMessage("Operation failed. Please try again.");
    }
  };

  // Handle cancel edit
  const handleCancel = () => {
    setForm({ name: "", description: "", ownerId: "", status: "Not Started" });
    setErrors({});
    setMessage("");
    onCancelEdit();
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6 w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
        {editingProject ? "Edit Project" : "Add New Project"}
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Project Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 border-gray-300"
            placeholder="e.g. Website Redesign"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        <div className="mb-6">
          <label className="block mb-1 font-medium">
            Description <span className="text-gray-400">(optional)</span>
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 border-gray-300"
            placeholder="Brief description of the project..."
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">
            PIC <span className="text-gray-400">(optional)</span>
          </label>
          <select
            name="ownerId"
            value={form.ownerId}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 border-gray-300"
          >
            <option value="">Unassigned</option>
            {users.map((user) => (
              <option key={user.userId} value={user.userId}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label className="block mb-1 font-medium">Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 border-gray-300"
          >
            <option value="Not Started">Not Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="flex-1 bg-blue-200 text-blue-800 py-2 rounded-lg hover:bg-blue-300 font-semibold shadow-sm hover:shadow transition"
          >
            {editingProject ? "Save Changes" : "Add Project"}
          </button>
          {editingProject && (
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

export default ProjectForm;
