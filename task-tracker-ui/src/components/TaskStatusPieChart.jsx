import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

// Status color for tasks
const STATUS_COLORS = {
  "To Do": "#FFCDD2",
  "In Progress": "#BBDEFB",
  Completed: "#C8E6C9",
};

// Pie chart for task status distribution
function TaskStatusPieChart({ data }) {
  if (data.length === 0) {
    return <p className="text-gray-500 text-center mt-24">No task data available yet.</p>;
  }

  return (
    <div className="h-72 min-w-0 min-h-[288px]">
      <ResponsiveContainer width="100%" height="100%" minWidth={0}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={95}
            label
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={STATUS_COLORS[entry.name] || "#D1D5DB"} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default TaskStatusPieChart;
