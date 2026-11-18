import { useState, useEffect } from "react";
import { addTask, editTask } from "../API/TaskAPI";
import { fetchProjects } from "../API/ProjectAPI";
import { fetchUsers } from "../API/UserAPI";
import { Alert, Button, Field, inputClass } from "./PageUI";

const EMPTY_FORM = {
  title: "",
  description: "",
  status: "To Do",
  priority: "Medium",
  dueDate: "",
  projectId: "",
  assignedTo: "",
};

const PRIORITY_OPTIONS = [
  { value: "Low", active: "border-slate-400 bg-slate-100 text-slate-800" },
  { value: "Medium", active: "border-amber-400 bg-amber-50 text-amber-800" },
  { value: "High", active: "border-rose-400 bg-rose-50 text-rose-700" },
];

// Form for creating and editing tasks
function TaskForm({ editingTask, onSuccess, onCancelEdit }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

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

    setSaving(true);
    setMessage("");
    try {
      if (editingTask) {
        await editTask(editingTask.taskId, payload);
      } else {
        await addTask(payload);
        setForm(EMPTY_FORM);
      }
      onSuccess();
    } catch {
      setMessage("Operation failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Handle cancel edit
  const handleCancel = () => {
    setForm(EMPTY_FORM);
    setErrors({});
    setMessage("");
    onCancelEdit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {message && <Alert>{message}</Alert>}

      <Field label="Task title" error={errors.title}>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          className={inputClass(!!errors.title)}
          placeholder="e.g. Design homepage layout"
          autoFocus
        />
      </Field>

      <Field label="Description" optional>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={3}
          className={`${inputClass()} resize-none`}
          placeholder="Task details..."
        />
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Project" error={errors.projectId}>
          <select
            name="projectId"
            value={form.projectId}
            onChange={handleChange}
            className={inputClass(!!errors.projectId)}
          >
            <option value="">Select a project</option>
            {projects.map((p) => (
              <option key={p.projectId} value={p.projectId}>
                {p.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Assign to" optional>
          <select name="assignedTo" value={form.assignedTo} onChange={handleChange} className={inputClass()}>
            <option value="">Unassigned</option>
            {users.map((u) => (
              <option key={u.userId} value={u.userId}>
                {u.name} ({u.role})
              </option>
            ))}
          </select>
        </Field>

        <Field label="Status">
          <select name="status" value={form.status} onChange={handleChange} className={inputClass()}>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </Field>

        <Field label="Due date" optional>
          <input
            name="dueDate"
            type="date"
            value={form.dueDate}
            onChange={handleChange}
            className={inputClass()}
          />
        </Field>
      </div>

      <Field label="Priority">
        <div className="grid grid-cols-3 gap-2" role="radiogroup">
          {PRIORITY_OPTIONS.map(({ value, active }) => {
            const selected = form.priority === value;
            return (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => setForm({ ...form, priority: value })}
                className={`rounded-full border px-3 py-2 text-sm font-semibold transition ${
                  selected
                    ? `${active} ring-2 ring-offset-1 ring-transparent`
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                {value}
              </button>
            );
          })}
        </div>
      </Field>

      <div className="flex justify-end gap-2 border-t border-slate-100 pt-5">
        <Button variant="secondary" onClick={handleCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={saving}>
          {editingTask ? "Save changes" : "Create task"}
        </Button>
      </div>
    </form>
  );
}

export default TaskForm;
