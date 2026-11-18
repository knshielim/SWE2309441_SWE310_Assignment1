import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const tooltipStyle = {
  borderRadius: 12,
  border: "1px solid #e9e0d5",
  boxShadow: "0 10px 15px -3px rgb(89 74 64 / 0.10)",
  fontSize: 13,
};

// Area chart for completed tasks over time
function CompletedTasksLineChart({ data }) {
  if (data.length === 0) {
    return <p className="py-24 text-center text-sm text-slate-500">No completed task data yet.</p>;
  }

  return (
    <div className="h-64 min-h-[256px] min-w-0">
      <ResponsiveContainer width="100%" height="100%" minWidth={0}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="fillCumulative" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7c86cf" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#7c86cf" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="fillDaily" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#df8ca2" stopOpacity={0.2} />
              <stop offset="100%" stopColor="#df8ca2" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#efe6da" vertical={false} />
          <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: "#8e7d6d", fontSize: 12 }} />
          <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fill: "#b5a493", fontSize: 12 }} />
          <Tooltip contentStyle={tooltipStyle} />
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
          <Area
            type="monotone"
            dataKey="cumulative"
            name="Total completed"
            stroke="#7c86cf"
            strokeWidth={2.5}
            fill="url(#fillCumulative)"
            dot={false}
            activeDot={{ r: 5 }}
          />
          <Area
            type="monotone"
            dataKey="completed"
            name="Completed (daily)"
            stroke="#df8ca2"
            strokeWidth={2.5}
            fill="url(#fillDaily)"
            dot={{ r: 3, strokeWidth: 0, fill: "#df8ca2" }}
            activeDot={{ r: 5 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default CompletedTasksLineChart;
