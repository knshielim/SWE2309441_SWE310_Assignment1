import UserTableItem from "./UserTableItem";
import { DataTable, EmptyState } from "./PageUI";

const COLUMNS = [
  { label: "User", className: "min-w-64" },
  { label: "Role" },
  { label: "Active Tasks" },
  { label: "Joined" },
  { label: "Actions", align: "right" },
];

// Table to display list of users
function UserTable({ users, onDelete, onEdit, emptyAction }) {
  if (users.length === 0) {
    return (
      <EmptyState
        icon="users"
        title="No users found"
        message="Try a different search, or add a new team member."
        action={emptyAction}
      />
    );
  }

  return (
    <DataTable columns={COLUMNS}>
      {users.map((user) => (
        <UserTableItem key={user.userId} user={user} onDelete={onDelete} onEdit={onEdit} />
      ))}
    </DataTable>
  );
}

export default UserTable;
