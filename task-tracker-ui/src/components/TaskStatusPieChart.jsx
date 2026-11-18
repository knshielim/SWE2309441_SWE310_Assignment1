import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { STATUS_HEX } from "./PageUI";

const tooltipStyle = {
  borderRadius: 12,
  border: "1px solid #e9e0d5",
  boxShadow: "0 10px 15px -3px rgb(89 74 64 / 0.10)",
  fontSize: 13,
};

// Donut chart for task status distribution
function TaskStatusPieChart({ data, total }) {
  if (data.length === 0) {
    return <p className="py-24 text-center text-sm text-slate-500">No task data available yet.</p>;
  }

  return (
    <div>
      <div className="relative h-52 min-h-[208px] min-w-0">
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={62}
              outerRadius={88}
              paddingAngle={data.length > 1 ? 3 : 0}
              stroke="none"
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={STATUS_HEX[entry.name] || "#d8cbbc"} />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-slate-900">{total}</span>
          <span className="text-xs text-slate-500">total tasks</span>
        </div>
      </div>
      <ul className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1">
        {data.map((entry) => (
          <li key={entry.name} className="flex items-center gap-1.5 text-xs text-slate-600">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: STATUS_HEX[entry.name] }} />
            {entry.name}
            <span className="font-semibold text-slate-800">{entry.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TaskStatusPieChart;
