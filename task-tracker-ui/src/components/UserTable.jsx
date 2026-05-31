import UserTableItem from "./UserTableItem";
import { ENTITY_STYLE } from "./PageUI";

// Table to display list of users
function UserTable({ users, onDelete, onEdit }) {
  if (users.length === 0) {
    return <p className={`text-center py-6 ${ENTITY_STYLE.empty}`}>No users found.</p>;
  }

  return (
    <div className={`overflow-x-auto rounded-lg border bg-white ${ENTITY_STYLE.tableWrap}`}>
      <table className="min-w-full">
        <thead>
          <tr className={ENTITY_STYLE.tableHead}>
            <th className="py-3 px-4 text-left font-semibold">ID</th>
            <th className="py-3 px-4 text-left font-semibold">Name</th>
            <th className="py-3 px-4 text-left font-semibold">Email</th>
            <th className="py-3 px-4 text-left font-semibold">Role</th>
            <th className="py-3 px-4 text-left font-semibold">Active Tasks</th>
            <th className="py-3 px-4 text-left font-semibold">Created</th>
            <th className="py-3 px-4 text-center font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, idx) => (
            <UserTableItem
              key={user.userId}
              user={user}
              idx={idx}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserTable;
