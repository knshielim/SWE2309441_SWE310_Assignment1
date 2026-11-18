import { useState, useEffect } from "react";
import { fetchProjects } from "../API/ProjectAPI";
import { fetchTasks } from "../API/TaskAPI";
import { fetchUsers } from "../API/UserAPI";
import OverviewBarChart from "../components/OverviewBarChart";
import TaskStatusPieChart from "../components/TaskStatusPieChart";
import CompletedTasksLineChart from "../components/CompletedTasksLineChart";
import {
  Card,
  LoadingState,
  PageHeader,
  ProgressBar,
  SectionTitle,
  STATUS_HEX,
  daysUntil,
  formatDate,
  relativeDue,
} from "../components/PageUI";
import Icon from "../components/Icons";

// Dashboard page
function Dashboard() {
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalTasks: 0,
    totalUsers: 0,
    tasksToDo: 0,
    tasksInProgress: 0,
    tasksCompleted: 0,
  });
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [productivityData, setProductivityData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  // Fetch all data for dashboard
  const fetchData = async () => {
    try {
      const [projects, tasks, users] = await Promise.all([
        fetchProjects(),
        fetchTasks(),
        fetchUsers(),
      ]);

      const projectMap = new Map(projects.map((p) => [p.projectId, p.name]));
      const userMap = new Map(users.map((u) => [u.userId, u.name]));
      const now = new Date();

      const openTasks = tasks.filter((t) => t.status !== "Completed");
      setUpcomingDeadlines(
        openTasks
          .filter((t) => t.dueDate)
          .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
          .slice(0, 5)
          .map((t) => ({
            taskId: t.taskId,
            title: t.title,
            dueDate: t.dueDate,
            projectName: projectMap.get(t.projectId) ?? `Project ${t.projectId}`,
            priority: t.priority,
          }))
      );

      const completedActivities = tasks
        .filter((t) => t.status === "Completed")
        .map((t) => ({
          date: t.dueDate ?? t.createdAt ?? now.toISOString(),
          text: `${userMap.get(t.assignedTo) ?? "Someone"} completed "${t.title}"`,
          type: "task",
        }));

      const projectActivities = projects.map((p) => ({
        date: p.createdAt ?? now.toISOString(),
        text: `Project "${p.name}" was created`,
        type: "project",
      }));

      const userActivities = users.map((u) => ({
        date: u.createdAt ?? now.toISOString(),
        text: `${u.name} joined as ${u.role}`,
        type: "user",
      }));

      setRecentActivities(
        [...completedActivities, ...projectActivities, ...userActivities]
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 6)
      );

      const last7Days = [];
      for (let i = 6; i >= 0; i--) {
        const day = new Date();
        day.setDate(day.getDate() - i);
        const dateKey = day.toISOString().split("T")[0];
        last7Days.push({
          date: dateKey,
          name: day.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
          completed: 0,
          cumulative: 0,
        });
      }

      tasks
        .filter((t) => t.status === "Completed")
        .forEach((t) => {
          const dateKey = (t.dueDate ?? t.createdAt ?? "").split("T")[0];
          const dayRow = last7Days.find((d) => d.date === dateKey);
          if (dayRow) dayRow.completed += 1;
        });

      let runningTotal = 0;
      last7Days.forEach((d) => {
        runningTotal += d.completed;
        d.cumulative = runningTotal;
      });
      setProductivityData(last7Days);

      setStats({
        totalProjects: projects.length,
        totalTasks: tasks.length,
        totalUsers: users.length,
        tasksToDo: tasks.filter((t) => t.status === "To Do").length,
        tasksInProgress: tasks.filter((t) => t.status === "In Progress").length,
        tasksCompleted: tasks.filter((t) => t.status === "Completed").length,
      });
    } catch (error) {
      console.error("Error loading dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingState label="Loading dashboard..." />;
  }

  const overviewData = [
    { name: "Projects", value: stats.totalProjects },
    { name: "Tasks", value: stats.totalTasks },
    { name: "Users", value: stats.totalUsers },
  ];

  const taskStatusData = [
    { name: "To Do", value: stats.tasksToDo },
    { name: "In Progress", value: stats.tasksInProgress },
    { name: "Completed", value: stats.tasksCompleted },
  ].filter((item) => item.value > 0);

  const completionRate =
    stats.totalTasks === 0 ? 0 : Math.round((stats.tasksCompleted / stats.totalTasks) * 100);

  const statusRows = [
    { label: "To Do", value: stats.tasksToDo },
    { label: "In Progress", value: stats.tasksInProgress },
    { label: "Completed", value: stats.tasksCompleted },
  ];

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div>
      <PageHeader icon="dashboard" title="Dashboard" subtitle={`Welcome back — ${today}`} />

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon="folder" label="Projects" value={stats.totalProjects} tone="blue" />
        <StatCard icon="check" label="Tasks" value={stats.totalTasks} tone="pink" />
        <StatCard icon="users" label="Team members" value={stats.totalUsers} tone="violet" />
        <StatCard
          icon="checkCircle"
          label="Completion rate"
          value={`${completionRate}%`}
          tone="emerald"
          footer={<ProgressBar percent={completionRate} />}
        />
      </div>

      <SectionTitle>Task status breakdown</SectionTitle>
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {statusRows.map((row) => {
          const share = stats.totalTasks === 0 ? 0 : Math.round((row.value / stats.totalTasks) * 100);
          return (
            <div
              key={row.label}
              className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm font-medium text-slate-600">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: STATUS_HEX[row.label] }} />
                  {row.label}
                </span>
                <span className="text-xs text-slate-400">{share}%</span>
              </div>
              <p className="mt-2 text-2xl font-bold text-slate-900">{row.value}</p>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${share}%`, backgroundColor: STATUS_HEX[row.label] }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Card title="Completed tasks — last 7 days" icon="activity" className="lg:col-span-3">
          <CompletedTasksLineChart data={productivityData} />
        </Card>
        <Card title="Task status distribution" icon="clock" className="lg:col-span-2">
          <TaskStatusPieChart data={taskStatusData} total={stats.totalTasks} />
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card title="Overview" icon="dashboard" className="lg:mb-0">
          <OverviewBarChart data={overviewData} />
        </Card>

        <Card title="Upcoming deadlines" icon="calendar" className="lg:mb-0">
          {upcomingDeadlines.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-500">No upcoming deadlines.</p>
          ) : (
            <ul className="-mx-2 divide-y divide-slate-100">
              {upcomingDeadlines.map((item) => {
                const days = daysUntil(item.dueDate);
                const tone =
                  days < 0
                    ? "bg-rose-50 text-rose-700"
                    : days <= 2
                    ? "bg-amber-50 text-amber-700"
                    : "bg-slate-100 text-slate-600";
                const date = new Date(item.dueDate);
                return (
                  <li key={item.taskId} className="flex items-center gap-3 px-2 py-2.5">
                    <div className={`flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-lg ${tone}`}>
                      <span className="text-[10px] font-semibold uppercase leading-none">
                        {date.toLocaleDateString("en-US", { month: "short" })}
                      </span>
                      <span className="text-base font-bold leading-tight">{date.getDate()}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-800">{item.title}</p>
                      <p className="truncate text-xs text-slate-500">{item.projectName}</p>
                    </div>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${tone}`}>
                      {relativeDue(item.dueDate)}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>

        <Card title="Recent activity" icon="activity" className="mb-0">
          {recentActivities.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-500">No recent activity yet.</p>
          ) : (
            <ol className="relative space-y-4 before:absolute before:bottom-2 before:left-[13px] before:top-2 before:w-px before:bg-slate-200">
              {recentActivities.map((activity, index) => (
                <li key={index} className="relative flex gap-3">
                  <span
                    className={`relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ring-4 ring-white ${ACTIVITY_STYLE[activity.type].className}`}
                  >
                    <Icon name={ACTIVITY_STYLE[activity.type].icon} className="h-3.5 w-3.5" />
                  </span>
                  <div className="min-w-0 pt-0.5">
                    <p className="text-sm text-slate-700">{activity.text}</p>
                    <p className="text-xs text-slate-400">{formatDate(activity.date)}</p>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </Card>
      </div>
    </div>
  );
}

const ACTIVITY_STYLE = {
  task: { icon: "checkCircle", className: "bg-emerald-100 text-emerald-600" },
  project: { icon: "folder", className: "bg-blue-100 text-blue-600" },
  user: { icon: "users", className: "bg-pink-100 text-pink-600" },
};

const STAT_TONES = {
  blue: "bg-blue-50 text-blue-600",
  pink: "bg-pink-50 text-pink-600",
  violet: "bg-violet-50 text-violet-600",
  emerald: "bg-emerald-50 text-emerald-600",
};

function StatCard({ icon, label, value, tone = "blue", footer }) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{value}</p>
        </div>
        <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${STAT_TONES[tone]}`}>
          <Icon name={icon} className="h-5 w-5" />
        </span>
      </div>
      {footer && <div className="mt-4">{footer}</div>}
    </div>
  );
}

export default Dashboard;
