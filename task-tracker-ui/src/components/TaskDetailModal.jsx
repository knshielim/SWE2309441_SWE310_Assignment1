import { useState, useEffect } from "react";
import { fetchComments, addComment, deleteComment } from "../API/CommentAPI";
import { fetchUsers } from "../API/UserAPI";
import FormModal from "./FormModal";
import { Alert, Button, StatusBadge, formatDate, inputClass, relativeDue, daysUntil } from "./PageUI";
import { FeedItem, MetaItem } from "./DetailParts";
import Icon from "./Icons";

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
  const [posting, setPosting] = useState(false);
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
    setPosting(true);
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
    } finally {
      setPosting(false);
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

  const getUserName = (id) => users.find((u) => u.userId === id)?.name;
  const overdue = task.status !== "Completed" && (daysUntil(task.dueDate) ?? 0) < 0;

  return (
    <FormModal
      onClose={onClose}
      maxWidth="max-w-2xl"
      title={task.title}
      subtitle={
        <span className="inline-flex items-center gap-1.5">
          <Icon name="folder" className="h-3.5 w-3.5" />
          {task.projectName ?? "No project"}
        </span>
      }
    >
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <MetaItem label="Status">
          <StatusBadge value={task.status} />
        </MetaItem>
        <MetaItem label="Priority">
          <StatusBadge value={task.priority} kind="priority" />
        </MetaItem>
        <MetaItem label="Assignee">
          <span className={task.assignedToName ? "font-medium" : "text-slate-400"}>
            {task.assignedToName ?? "Unassigned"}
          </span>
        </MetaItem>
        <MetaItem label="Due date">
          <span className={overdue ? "font-semibold text-rose-600" : ""}>{formatDate(task.dueDate)}</span>
          {task.dueDate && task.status !== "Completed" && (
            <p className={`text-xs ${overdue ? "text-rose-500" : "text-slate-400"}`}>
              {relativeDue(task.dueDate)}
            </p>
          )}
        </MetaItem>
      </div>

      {task.description && (
        <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-slate-600">
          {task.description}
        </p>
      )}

      <div className="mt-6 flex items-center gap-2">
        <Icon name="message" className="h-4 w-4 text-slate-400" />
        <h3 className="text-sm font-semibold text-slate-800">Comments &amp; updates</h3>
        {!loading && (
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
            {comments.length}
          </span>
        )}
      </div>

      {error && (
        <div className="mt-3">
          <Alert>{error}</Alert>
        </div>
      )}

      <form
        onSubmit={handleAddComment}
        className="mt-3 space-y-3 rounded-xl border border-slate-200 bg-slate-50/60 p-3"
      >
        <textarea
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          rows={3}
          placeholder="Write an update for the team..."
          className={`${inputClass()} resize-none`}
        />
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <label className="flex items-center gap-2 whitespace-nowrap text-xs text-slate-500">
            Posting as
            <select
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className={`${inputClass()} w-auto py-1.5`}
            >
              {users.map((u) => (
                <option key={u.userId} value={u.userId}>
                  {u.name}
                </option>
              ))}
            </select>
          </label>
          <Button type="submit" size="sm" icon="send" loading={posting} disabled={!noteText.trim()}>
            Post comment
          </Button>
        </div>
      </form>

      <div className="mt-4">
        {loading ? (
          <p className="flex items-center gap-2 py-4 text-sm text-slate-500">
            <Icon name="loader" className="h-4 w-4 animate-spin" /> Loading comments...
          </p>
        ) : comments.length === 0 ? (
          <p className="py-6 text-center text-sm text-slate-500">
            No comments yet. Be the first to add an update.
          </p>
        ) : (
          <ul className="scroll-thin max-h-80 space-y-3 overflow-y-auto pr-1">
            {comments.map((comment) => (
              <FeedItem
                key={comment.commentId}
                author={comment.authorName ?? getUserName(comment.userId) ?? `User ${comment.userId}`}
                date={comment.createdAt}
                content={comment.content}
                onDelete={() => handleDeleteComment(comment.commentId)}
              />
            ))}
          </ul>
        )}
      </div>
    </FormModal>
  );
}

export default TaskDetailModal;
