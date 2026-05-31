import { useState, useEffect } from "react";
import { fetchUsers, deleteUser } from "../API/UserAPI";
import { fetchTasks } from "../API/TaskAPI";
import UserTable from "../components/UserTable";
import UserForm from "../components/UserForm";
import FormModal from "../components/FormModal";
import { PageHeader, Panel } from "../components/PageUI";
import SearchBar from "../components/SearchBar";

// Users page
function Users() {
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  // Fetch users and calculate active tasks
  const fetchData = async () => {
    try {
      const [userData, taskData] = await Promise.all([fetchUsers(), fetchTasks()]);
      const sorted = [...userData]
        .map((user) => ({
          ...user,
          activeTaskCount: taskData.filter(
            (t) => t.assignedTo === user.userId && t.status !== "Completed"
          ).length,
        }))
        .sort((a, b) => a.userId - b.userId);
      setUsers(sorted);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle user deletion
  const handleDelete = async (userId) => {
    try {
      await deleteUser(userId);
      setUsers(users.filter((u) => u.userId !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user.");
    }
  };

  // Handle user edit
  const handleEdit = (user) => {
    setEditingUser(user);
    setShowForm(true);
  };

  // Handle form success
  const handleFormSuccess = () => {
    fetchData();
    setEditingUser(null);
    setShowForm(false);
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingUser(null);
    setShowForm(false);
  };

  const filteredUsers = users.filter((u) => {
    if (!searchText.trim()) return true;
    const term = searchText.trim().toLowerCase();
    return (
      u.name.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term) ||
      u.role.toLowerCase().includes(term)
    );
  });

  return (
    <div>
      <PageHeader
        icon="👤"
        title="Users"
        buttonLabel="Add New User"
        onAdd={() => {
          setEditingUser(null);
          setShowForm(true);
        }}
      />

      <Panel>
        <p className="text-sm font-medium text-gray-600 mb-2">Search users</p>
        <SearchBar
          value={searchText}
          onChange={setSearchText}
          placeholder="Search by name, email, or role..."
        />
      </Panel>

      {loading ? (
        <p className="text-center text-gray-500 py-6">Loading users...</p>
      ) : (
        <UserTable users={filteredUsers} onDelete={handleDelete} onEdit={handleEdit} />
      )}

      {showForm && (
        <FormModal onClose={handleCancelEdit}>
          <UserForm
            editingUser={editingUser}
            onSuccess={handleFormSuccess}
            onCancelEdit={handleCancelEdit}
          />
        </FormModal>
      )}
    </div>
  );
}

export default Users;
