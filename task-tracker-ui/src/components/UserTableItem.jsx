import { ENTITY_STYLE, SUB_STYLE } from "./PageUI";

// Table row for a single user
function UserTableItem({ user, idx, onDelete, onEdit }) {
  // Handle user deletion with confirmation
  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete user "${user.name}"?`)) {
      onDelete(user.userId);
    }
  };

  return (
    <tr
      className={`${idx % 2 === 0 ? ENTITY_STYLE.rowEven : ENTITY_STYLE.rowOdd} ${ENTITY_STYLE.rowHover} transition-colors`}
    >
      <td className="py-2 px-4 text-gray-600">{user.userId}</td>
      <td className="py-2 px-4 font-medium text-gray-800">{user.name}</td>
      <td className="py-2 px-4 text-gray-700">{user.email}</td>
      <td className="py-1 px-4 whitespace-nowrap">
        <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-sm">
          {user.role}
        </span>
      </td>
      <td className="py-2 px-4">
        <span className={`inline-flex min-w-7 justify-center px-2 py-0.5 rounded text-sm font-medium ${SUB_STYLE.badge}`}>
          {user.activeTaskCount ?? 0}
        </span>
      </td>
      <td className="py-1 px-4 text-gray-600 whitespace-nowrap">{user.createdAt?.split("T")[0]}</td>
      <td className="py-2 px-4 text-center flex gap-2 justify-center">
        <button
          onClick={() => onEdit(user)}
          className={`px-3 py-1 rounded text-sm transition ${ENTITY_STYLE.editBtn}`}
          style={{ width: 60 }}
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          className={`px-3 py-1 rounded text-sm transition ${SUB_STYLE.deleteBtn}`}
          style={{ width: 70 }}
        >
          Delete
        </button>
      </td>
    </tr>
  );
}

export default UserTableItem;
