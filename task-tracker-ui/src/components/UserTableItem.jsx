import { IconButton, Person, formatDate } from "./PageUI";

// Table row for a single user
function UserTableItem({ user, onDelete, onEdit }) {
  // Handle user deletion with confirmation
  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete user "${user.name}"?`)) {
      onDelete(user.userId);
    }
  };

  const active = user.activeTaskCount ?? 0;

  return (
    <tr className="transition-colors hover:bg-slate-50/80">
      <td className="px-4 py-3.5">
        <Person name={user.name} sub={user.email} />
      </td>
      <td className="px-4 py-3.5">
        <span className="inline-flex whitespace-nowrap rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
          {user.role}
        </span>
      </td>
      <td className="px-4 py-3.5">
        <span
          className={`inline-flex min-w-8 items-center justify-center rounded-full px-2 py-0.5 text-xs font-semibold ${
            active === 0
              ? "bg-slate-100 text-slate-500"
              : active >= 5
              ? "bg-pink-100 text-pink-700"
              : "bg-blue-50 text-blue-700"
          }`}
        >
          {active}
        </span>
      </td>
      <td className="whitespace-nowrap px-4 py-3.5 text-sm text-slate-500">
        {formatDate(user.createdAt)}
      </td>
      <td className="px-4 py-3.5">
        <div className="flex justify-end gap-1">
          <IconButton icon="edit" label="Edit user" tone="primary" onClick={() => onEdit(user)} />
          <IconButton icon="trash" label="Delete user" tone="danger" onClick={handleDelete} />
        </div>
      </td>
    </tr>
  );
}

export default UserTableItem;
