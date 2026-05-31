import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

// Line chart for completed tasks over time
function CompletedTasksLineChart({ data }) {
  if (data.length === 0) {
    return <p className="text-gray-500 text-center mt-24">No completed task data yet.</p>;
  }

  return (
    <div className="h-72 min-w-0 min-h-[288px]">
      <ResponsiveContainer width="100%" height="100%" minWidth={0}>
        <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="completed"
            name="Completed (daily)"
            stroke="#F9A8D4"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="cumulative"
            name="Total completed"
            stroke="#60A5FA"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default CompletedTasksLineChart;
