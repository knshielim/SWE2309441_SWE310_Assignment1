import { useState, useEffect } from "react";
import { addProject, editProject } from "../API/ProjectAPI";
import { fetchUsers } from "../API/UserAPI";
import { Alert, Button, Field, inputClass } from "./PageUI";

const EMPTY_FORM = { name: "", description: "", ownerId: "", status: "Not Started" };

// Form for creating and editing projects
function ProjectForm({ editingProject, onSuccess, onCancelEdit }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

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

    setSaving(true);
    setMessage("");
    try {
      if (editingProject) {
        await editProject(editingProject.projectId, form);
      } else {
        await addProject(form);
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

      <Field label="Project name" error={errors.name}>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          className={inputClass(!!errors.name)}
          placeholder="e.g. Website Redesign"
          autoFocus
        />
      </Field>

      <Field
        label="Description"
        optional
        error={errors.description}
        hint={`${form.description.length}/500 characters`}
      >
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={3}
          className={`${inputClass(!!errors.description)} resize-none`}
          placeholder="Brief description of the project..."
        />
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="PIC" optional>
          <select name="ownerId" value={form.ownerId} onChange={handleChange} className={inputClass()}>
            <option value="">Unassigned</option>
            {users.map((user) => (
              <option key={user.userId} value={user.userId}>
                {user.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Status">
          <select name="status" value={form.status} onChange={handleChange} className={inputClass()}>
            <option value="Not Started">Not Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </Field>
      </div>

      <div className="flex justify-end gap-2 border-t border-slate-100 pt-5">
        <Button variant="secondary" onClick={handleCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={saving}>
          {editingProject ? "Save changes" : "Create project"}
        </Button>
      </div>
    </form>
  );
}

export default ProjectForm;
