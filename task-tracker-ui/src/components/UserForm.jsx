import { useState, useEffect } from "react";
import { addUser, editUser } from "../API/UserAPI";
import { Alert, Button, Field, inputClass } from "./PageUI";

const EMPTY_FORM = { name: "", email: "", role: "Member" };

const ROLES = [
  "Member",
  "Project Manager",
  "Lead Developer",
  "Backend Developer",
  "Frontend Developer",
  "QA Engineer",
  "DevOps Engineer",
  "UI/UX Designer",
  "Business Analyst",
];

// Form for creating and editing users
function UserForm({ editingUser, onSuccess, onCancelEdit }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editingUser) {
      setForm({
        name: editingUser.name,
        email: editingUser.email,
        role: editingUser.role,
      });
      setMessage("");
      setErrors({});
    }
  }, [editingUser]);

  // Handle input changes and clear errors
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  // Validate form inputs
  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required.";
    if (!form.email.trim()) newErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Enter a valid email address.";
    if (!form.role.trim()) newErrors.role = "Role is required.";
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
      if (editingUser) {
        await editUser(editingUser.userId, form);
      } else {
        await addUser(form);
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

  // Keep the current role selectable even if it is not in the preset list
  const roleOptions = ROLES.includes(form.role) || !form.role ? ROLES : [form.role, ...ROLES];

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {message && <Alert>{message}</Alert>}

      <Field label="Full name" error={errors.name}>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          className={inputClass(!!errors.name)}
          placeholder="e.g. Jane Doe"
          autoFocus
        />
      </Field>

      <Field label="Email" error={errors.email}>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          className={inputClass(!!errors.email)}
          placeholder="user@example.com"
        />
      </Field>

      <Field label="Role" error={errors.role}>
        <select name="role" value={form.role} onChange={handleChange} className={inputClass(!!errors.role)}>
          {roleOptions.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      </Field>

      <div className="flex justify-end gap-2 border-t border-slate-100 pt-5">
        <Button variant="secondary" onClick={handleCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={saving}>
          {editingUser ? "Save changes" : "Add user"}
        </Button>
      </div>
    </form>
  );
}

export default UserForm;
