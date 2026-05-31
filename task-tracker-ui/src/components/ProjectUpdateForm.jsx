import { useState, useEffect } from "react";
import { createProjectUpdate, updateProjectUpdate } from "../API/ProjectUpdateAPI";
import { fetchUsers } from "../API/UserAPI";

// Form for creating and editing project updates
function ProjectUpdateForm({ projectId, editingUpdate, onSuccess, onCancelEdit }) {
  // Form state for update data
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [userId, setUserId] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers().then(setUsers);
    if (editingUpdate) {
      setTitle(editingUpdate.title);
      setContent(editingUpdate.content);
      setUserId(editingUpdate.userId.toString());
    }
  }, [editingUpdate]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updateData = {
        projectId,
        userId: parseInt(userId),
        title,
        content,
      };

      if (editingUpdate) {
        await updateProjectUpdate(editingUpdate.updateId, { title, content });
      } else {
        await createProjectUpdate(updateData);
      }

      onSuccess();
    } catch (error) {
      console.error("Error saving project update:", error);
      alert("Failed to save project update.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
          required
          maxLength={200}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Author
        </label>
        <select
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
          required
        >
          <option value="">Select a user</option>
          {users.map((user) => (
            <option key={user.userId} value={user.userId}>
              {user.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Content
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
          rows={4}
          required
          maxLength={1000}
        />
      </div>

      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={onCancelEdit}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-200 text-blue-800 rounded-md hover:bg-blue-300 transition disabled:opacity-50"
        >
          {loading ? "Saving..." : editingUpdate ? "Update" : "Add Update"}
        </button>
      </div>
    </form>
  );
}

export default ProjectUpdateForm;
