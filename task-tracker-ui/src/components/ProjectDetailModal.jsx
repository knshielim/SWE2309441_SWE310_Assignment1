import { useState, useEffect } from "react";
import { fetchProjectUpdates, createProjectUpdate, deleteProjectUpdate } from "../API/ProjectUpdateAPI";
import { fetchUsers } from "../API/UserAPI";
import FormModal from "./FormModal";
import { Alert, Button, ProgressBar, StatusBadge, formatDate, inputClass } from "./PageUI";
import { FeedItem, MetaItem } from "./DetailParts";
import Icon from "./Icons";

// Modal for project details and updates
function ProjectDetailModal({ project, onClose }) {
  // State for updates, users, and form
  const [updates, setUpdates] = useState([]);
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
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
    setPosting(true);
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
    } finally {
      setPosting(false);
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

  // Get user name by ID
  const getUserName = (id) => users.find((u) => u.userId === id)?.name;

  const percent = project.progressPercent ?? 0;
  const owner = project.ownerName && project.ownerName !== "Unassigned" ? project.ownerName : null;

  return (
    <FormModal
      onClose={onClose}
      maxWidth="max-w-2xl"
      title={project.name}
      subtitle={`Project #${project.projectId}`}
    >
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <MetaItem label="Status">
          <StatusBadge value={project.projectStatus ?? "Not Started"} />
        </MetaItem>
        <MetaItem label="Progress">
          <div className="flex items-center gap-2">
            <span className="font-semibold">{percent}%</span>
            <ProgressBar percent={percent} />
          </div>
        </MetaItem>
        <MetaItem label="PIC">
          <span className={owner ? "font-medium" : "text-slate-400"}>{owner ?? "Unassigned"}</span>
        </MetaItem>
        <MetaItem label="Created">{formatDate(project.createdAt)}</MetaItem>
      </div>

      {project.description && (
        <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-slate-600">
          {project.description}
        </p>
      )}

      <div className="mt-6 flex items-center gap-2">
        <Icon name="message" className="h-4 w-4 text-slate-400" />
        <h3 className="text-sm font-semibold text-slate-800">Project updates</h3>
        {!loading && (
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
            {updates.length}
          </span>
        )}
      </div>

      {error && (
        <div className="mt-3">
          <Alert>{error}</Alert>
        </div>
      )}

      <form
        onSubmit={handleAddUpdate}
        className="mt-3 space-y-3 rounded-xl border border-slate-200 bg-slate-50/60 p-3"
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_2fr]">
          <select
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className={inputClass()}
            aria-label="Posting as"
          >
            {users.map((u) => (
              <option key={u.userId} value={u.userId}>
                {u.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={inputClass()}
            placeholder="Update title"
            required
            maxLength={200}
          />
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          placeholder="Share progress, blockers or next steps..."
          className={`${inputClass()} resize-none`}
          required
          maxLength={1000}
        />
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400">{content.length}/1000</span>
          <Button
            type="submit"
            size="sm"
            icon="send"
            loading={posting}
            disabled={!title.trim() || !content.trim()}
          >
            Post update
          </Button>
        </div>
      </form>

      <div className="mt-4">
        {loading ? (
          <p className="flex items-center gap-2 py-4 text-sm text-slate-500">
            <Icon name="loader" className="h-4 w-4 animate-spin" /> Loading updates...
          </p>
        ) : updates.length === 0 ? (
          <p className="py-6 text-center text-sm text-slate-500">
            No updates yet. Be the first to post one.
          </p>
        ) : (
          <ul className="scroll-thin max-h-80 space-y-3 overflow-y-auto pr-1">
            {updates.map((update) => (
              <FeedItem
                key={update.updateId}
                author={update.authorName ?? getUserName(update.userId) ?? `User ${update.userId}`}
                date={update.createdAt}
                title={update.title}
                content={update.content}
                onDelete={() => handleDeleteUpdate(update.updateId)}
              />
            ))}
          </ul>
        )}
      </div>
    </FormModal>
  );
}

export default ProjectDetailModal;
