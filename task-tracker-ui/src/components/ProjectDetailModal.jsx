import { useState, useEffect } from "react";
import { fetchProjectUpdates, createProjectUpdate, deleteProjectUpdate } from "../API/ProjectUpdateAPI";
import { fetchUsers } from "../API/UserAPI";
import FormModal from "./FormModal";

// Modal for project details and updates
function ProjectDetailModal({ project, onClose }) {
  // State for updates, users, and form
  const [updates, setUpdates] = useState([]);
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load updates and users when project changes
  useEffect(() => {
    if (!project) return;

    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const [updatesData, userData] = await Promise.all([
          fetchProjectUpdates(project.projectId),
          fetchUsers(),
        ]);
        setUpdates(updatesData);
        setUsers(userData);
        if (userData.length > 0) setUserId(String(userData[0].userId));
      } catch (err) {
        setError(err.response?.data?.message || "Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    load();
    setTitle("");
    setContent("");
  }, [project]);

  // Handle adding a new project update
  const handleAddUpdate = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !userId) return;

    setError("");
    try {
      const created = await createProjectUpdate({
        projectId: project.projectId,
        userId: Number(userId),
        title: title.trim(),
        content: content.trim(),
      });
      setUpdates((prev) => [created, ...prev]);
      setTitle("");
      setContent("");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    }
  };

  // Handle deleting a project update
  const handleDeleteUpdate = async (updateId) => {
    if (!window.confirm("Delete this update?")) return;
    try {
      await deleteProjectUpdate(updateId);
      setUpdates((prev) => prev.filter((u) => u.updateId !== updateId));
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get user name by ID
  const getUserName = (userId) => {
    const user = users.find((u) => u.userId === userId);
    return user?.name || "Unknown";
  };

  return (
    <FormModal onClose={onClose} maxWidth="max-w-2xl">
      <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6 w-full">
        <h2 className="text-2xl font-bold mb-2 text-gray-800">{project.name}</h2>
        <p className="text-sm text-gray-500 mb-4">
          Status: {project.projectStatus ?? "Not Started"} · Progress: {project.progressPercent ?? 0}%
        </p>

        <div className="grid grid-cols-2 gap-3 text-sm mb-6">
          <div>
            <span className="font-medium text-gray-700">Project Owner:</span>{" "}
            {project.projectOwner ?? "Unassigned"}
          </div>
          <div>
            <span className="font-medium text-gray-700">Created:</span>{" "}
            {project.createdAt?.split("T")[0] ?? "—"}
          </div>
        </div>

        {project.description && (
          <p className="text-gray-600 mb-6 border-l-4 border-gray-200 pl-3">{project.description}</p>
        )}

        <h3 className="text-lg font-semibold text-gray-700 mb-3">Project Updates</h3>

        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

        <form onSubmit={handleAddUpdate} className="mb-6">
          <div className="mb-3">
            <label className="block mb-1 text-sm font-medium">Team member</label>
            <select
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 border-gray-300"
            >
              {users.map((u) => (
                <option key={u.userId} value={u.userId}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label className="block mb-1 text-sm font-medium">Update title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 border-gray-300"
              placeholder="Enter update title..."
              required
              maxLength={200}
            />
          </div>
          <div className="mb-3">
            <label className="block mb-1 text-sm font-medium">Update content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={3}
              placeholder="Write an update for the project..."
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 border-gray-300"
              required
              maxLength={1000}
            />
          </div>
          <button
            type="submit"
            className="bg-blue-200 text-blue-800 px-4 py-2 rounded-lg hover:bg-blue-300 font-semibold"
          >
            Post Update
          </button>
        </form>

        {loading ? (
          <p className="text-gray-500 text-sm">Loading updates...</p>
        ) : updates.length === 0 ? (
          <p className="text-gray-500 text-sm">No updates yet. Be the first to add an update.</p>
        ) : (
          <div className="space-y-3 max-h-48 overflow-y-auto">
            {updates.map((update) => (
              <div key={update.updateId} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span className="font-medium text-gray-700">
                    {update.authorName ?? `User ${update.userId}`}
                  </span>
                  <span>{formatDate(update.createdAt)}</span>
                </div>
                <h4 className="font-semibold text-sm text-gray-800 mb-1">{update.title}</h4>
                <p className="text-sm text-gray-800">{update.content}</p>
                <button
                  type="button"
                  onClick={() => handleDeleteUpdate(update.updateId)}
                  className="text-xs text-red-600 mt-2 hover:underline"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </FormModal>
  );
}

export default ProjectDetailModal;
