import { useState, useEffect } from "react";
import { fetchComments, addComment, deleteComment } from "../API/CommentAPI";
import { fetchUsers } from "../API/UserAPI";
import FormModal from "./FormModal";

// Function to extract error message
function getErrorMessage(error) {
  return error.response?.data?.message || "Something went wrong. Please try again.";
}

// Modal for task details and comments
function TaskDetailModal({ task, onClose }) {
  // State for comments, users, and form
  const [comments, setComments] = useState([]);
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState("");
  const [noteText, setNoteText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load comments and users when task changes
  useEffect(() => {
    if (!task) return;

    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const [commentData, userData] = await Promise.all([
          fetchComments(task.taskId),
          fetchUsers(),
        ]);
        setComments(commentData);
        setUsers(userData);
        if (userData.length > 0) setUserId(String(userData[0].userId));
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    load();
    setNoteText("");
  }, [task]);

  // Handle adding a new comment
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!noteText.trim() || !userId) return;

    setError("");
    try {
      const created = await addComment({
        taskId: task.taskId,
        userId: Number(userId),
        content: noteText.trim(),
      });
      setComments((prev) => [created, ...prev]);
      setNoteText("");
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  // Handle deleting a comment
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await deleteComment(commentId);
      setComments((prev) => prev.filter((c) => c.commentId !== commentId));
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <FormModal onClose={onClose} maxWidth="max-w-2xl">
      <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6 w-full">
        <h2 className="text-2xl font-bold mb-2 text-gray-800">{task.title}</h2>
        <p className="text-sm text-gray-500 mb-4">
          {task.projectName ?? "—"} · {task.status} · {task.priority} priority
        </p>

        <div className="grid grid-cols-2 gap-3 text-sm mb-6">
          <div>
            <span className="font-medium text-gray-700">Assigned to:</span>{" "}
            {task.assignedToName ?? "Unassigned"}
          </div>
          <div>
            <span className="font-medium text-gray-700">Due date:</span>{" "}
            {task.dueDate ? task.dueDate.split("T")[0] : "—"}
          </div>
        </div>

        {task.description && (
          <p className="text-gray-600 mb-6 border-l-4 border-gray-200 pl-3">{task.description}</p>
        )}

        <h3 className="text-lg font-semibold text-gray-700 mb-3">Comments &amp; Updates</h3>

        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

        <form onSubmit={handleAddComment} className="mb-6">
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
            <label className="block mb-1 text-sm font-medium">Add a note</label>
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              rows={3}
              placeholder="Write an update for the team..."
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 border-gray-300"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-200 text-blue-800 px-4 py-2 rounded-lg hover:bg-blue-300 font-semibold"
          >
            Post Comment
          </button>
        </form>

        {loading ? (
          <p className="text-gray-500 text-sm">Loading comments...</p>
        ) : comments.length === 0 ? (
          <p className="text-gray-500 text-sm">No comments yet. Be the first to add an update.</p>
        ) : (
          <div className="space-y-3 max-h-48 overflow-y-auto">
            {comments.map((comment) => (
              <div key={comment.commentId} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span className="font-medium text-gray-700">
                    {comment.authorName ?? `User ${comment.userId}`}
                  </span>
                  <span>{new Date(comment.createdAt).toLocaleString()}</span>
                </div>
                <p className="text-sm text-gray-800">{comment.content}</p>
                <button
                  type="button"
                  onClick={() => handleDeleteComment(comment.commentId)}
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

export default TaskDetailModal;
