import { useState, useEffect } from "react";
import { addUser, editUser } from "../API/UserAPI";

// Form for creating and editing users
function UserForm({ editingUser, onSuccess, onCancelEdit }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "Member",
  });
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

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

    try {
      if (editingUser) {
        await editUser(editingUser.userId, form);
        setMessage("User updated successfully!");
      } else {
        await addUser(form);
        setMessage("User added successfully!");
        setForm({ name: "", email: "", role: "Member" });
      }
      onSuccess();
    } catch (error) {
      setMessage("Operation failed. Please try again.");
    }
  };

  // Handle cancel edit
  const handleCancel = () => {
    setForm({ name: "", email: "", role: "Member" });
    setErrors({});
    setMessage("");
    onCancelEdit();
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6 w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
        {editingUser ? "Edit User" : "Add New User"}
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 border-gray-300"
            placeholder="Full name"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 border-gray-300"
            placeholder="user@example.com"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div className="mb-6">
          <label className="block mb-1 font-medium">Role</label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 border-gray-300"
          >
            <option value="Member">Member</option>
            <option value="Project Manager">Project Manager</option>
            <option value="Lead Developer">Lead Developer</option>
            <option value="Backend Developer">Backend Developer</option>
            <option value="Frontend Developer">Frontend Developer</option>
            <option value="QA Engineer">QA Engineer</option>
            <option value="DevOps Engineer">DevOps Engineer</option>
            <option value="UI/UX Designer">UI/UX Designer</option>
            <option value="Business Analyst">Business Analyst</option>
          </select>
          {errors.role && (
            <p className="text-red-500 text-sm mt-1">{errors.role}</p>
          )}
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="flex-1 bg-blue-200 text-blue-800 py-2 rounded-lg hover:bg-blue-300 font-semibold shadow-sm hover:shadow transition"
          >
            {editingUser ? "Save Changes" : "Add User"}
          </button>
          {editingUser && (
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

export default UserForm;
