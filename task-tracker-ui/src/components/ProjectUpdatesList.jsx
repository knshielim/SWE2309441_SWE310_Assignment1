import { useState, useEffect } from "react";
import { fetchProjectUpdates, deleteProjectUpdate } from "../API/ProjectUpdateAPI";
import { fetchUsers } from "../API/UserAPI";
import { Card } from "./PageUI";

// List component for displaying project updates
function ProjectUpdatesList({ projectId }) {
  // State for updates, users, and loading
  const [updates, setUpdates] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch updates when projectId changes
  useEffect(() => {
    fetchData();
  }, [projectId]);

  // Fetch updates and users
  const fetchData = async () => {
    try {
      const [updatesData, usersData] = await Promise.all([
        fetchProjectUpdates(projectId),
        fetchUsers(),
      ]);
      setUpdates(updatesData);
      setUsers(usersData);
    } catch (error) {
      console.error("Error fetching project updates:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle update deletion
  const handleDelete = async (updateId) => {
    if (window.confirm("Are you sure you want to delete this update?")) {
      try {
        await deleteProjectUpdate(updateId);
        setUpdates(updates.filter((u) => u.updateId !== updateId));
      } catch (error) {
        console.error("Error deleting update:", error);
        alert("Failed to delete update.");
      }
    }
  };

  // Get user name by ID
  const getUserName = (userId) => {
    const user = users.find((u) => u.userId === userId);
    return user?.name || "Unknown";
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

  if (loading) {
    return <p className="text-center text-gray-500 py-6">Loading updates...</p>;
  }

  if (updates.length === 0) {
    return (
      <Card accent="blue">
        <p className="text-gray-500 text-center py-4">No project updates yet.</p>
      </Card>
    );
  }

  return (
    <Card accent="blue">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Project Updates</h3>
      <div className="space-y-4">
        {updates.map((update) => (
          <div
            key={update.updateId}
            className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-semibold text-gray-800">{update.title}</h4>
              <button
                onClick={() => handleDelete(update.updateId)}
                className="text-pink-600 hover:text-pink-800 text-sm"
              >
                Delete
              </button>
            </div>
            <p className="text-gray-600 text-sm mb-3">{update.content}</p>
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>By {getUserName(update.userId)}</span>
              <span>{formatDate(update.createdAt)}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default ProjectUpdatesList;
