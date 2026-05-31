import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

// Bar chart for overview statistics
function OverviewBarChart({ data }) {
  return (
    <div className="h-72 min-w-0 min-h-[288px]">
      <ResponsiveContainer width="100%" height="100%" minWidth={0}>
        <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" name="Count" fill="#60A5FA" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default OverviewBarChart;
