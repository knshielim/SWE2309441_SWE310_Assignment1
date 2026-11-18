import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from "recharts";

const BAR_COLORS = ["#7c86cf", "#df8ca2", "#b39bd8"];

const tooltipStyle = {
  borderRadius: 12,
  border: "1px solid #e9e0d5",
  boxShadow: "0 10px 15px -3px rgb(89 74 64 / 0.10)",
  fontSize: 13,
};

// Bar chart for overview statistics
function OverviewBarChart({ data }) {
  return (
    <div className="h-64 min-h-[256px] min-w-0">
      <ResponsiveContainer width="100%" height="100%" minWidth={0}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#efe6da" vertical={false} />
          <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: "#8e7d6d", fontSize: 12 }} />
          <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fill: "#b5a493", fontSize: 12 }} />
          <Tooltip cursor={{ fill: "#f8f2ea" }} contentStyle={tooltipStyle} />
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
