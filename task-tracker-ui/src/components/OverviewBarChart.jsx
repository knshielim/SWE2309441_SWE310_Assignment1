import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from "recharts";

const BAR_COLORS = ["#3b82f6", "#ec4899", "#8b5cf6"];

const tooltipStyle = {
  borderRadius: 12,
  border: "1px solid #e2e8f0",
  boxShadow: "0 10px 15px -3px rgb(15 23 42 / 0.08)",
  fontSize: 13,
};

// Bar chart for overview statistics
function OverviewBarChart({ data }) {
  return (
    <div className="h-64 min-h-[256px] min-w-0">
      <ResponsiveContainer width="100%" height="100%" minWidth={0}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
          <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
          <Tooltip cursor={{ fill: "#f8fafc" }} contentStyle={tooltipStyle} />
          <Bar dataKey="value" name="Count" radius={[8, 8, 0, 0]} maxBarSize={48}>
            {data.map((entry, i) => (
              <Cell key={entry.name} fill={BAR_COLORS[i % BAR_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default OverviewBarChart;
