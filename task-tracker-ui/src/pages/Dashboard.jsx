import { useState, useEffect } from "react";
import { fetchProjects } from "../API/ProjectAPI";
import { fetchTasks } from "../API/TaskAPI";
import { fetchUsers } from "../API/UserAPI";
import OverviewBarChart from "../components/OverviewBarChart";
import TaskStatusPieChart from "../components/TaskStatusPieChart";
import CompletedTasksLineChart from "../components/CompletedTasksLineChart";
import { Card, SectionTitle } from "../components/PageUI";

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
          }))
      );

      const completedActivities = tasks
        .filter((t) => t.status === "Completed")
        .map((t) => ({
          date: t.dueDate ?? t.createdAt ?? now.toISOString(),
          text: `${userMap.get(t.assignedTo) ?? "Someone"} completed "${t.title}"`,
        }));

      const projectActivities = projects.map((p) => ({
        date: p.createdAt ?? now.toISOString(),
        text: `Project "${p.name}" was created`,
      }));

      const userActivities = users.map((u) => ({
        date: u.createdAt ?? now.toISOString(),
        text: `${u.name} joined as ${u.role}`,
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
    return <p className="text-center py-12 text-gray-500">Loading dashboard...</p>;
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

  return (
    <div>
      <div className="mb-8 p-5 bg-blue-50/70 rounded-lg border border-blue-200 shadow-sm border-l-4 border-l-blue-400 border-r-2 border-r-pink-200">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 ring-2 ring-pink-200 text-xl">
            📊
          </span>
          Dashboard
        </h1>
        <p className="text-blue-600/80 mt-2 text-sm font-medium">
          Welcome back — here is your project overview
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard icon="📁" label="Total Projects" value={stats.totalProjects} accent="blue" />
        <StatCard icon="✅" label="Total Tasks" value={stats.totalTasks} accent="pink" />
        <StatCard icon="👥" label="Team Members" value={stats.totalUsers} accent="blue" />
      </div>

      <SectionTitle>Task Status Breakdown</SectionTitle>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard icon="📝" label="To Do" value={stats.tasksToDo} neutral />
        <StatCard icon="⏳" label="In Progress" value={stats.tasksInProgress} neutral />
        <StatCard icon="🎉" label="Completed" value={stats.tasksCompleted} neutral />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card accent="blue">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Overview</h3>
          <OverviewBarChart data={overviewData} />
        </Card>
        <Card accent="pink">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Task Status Distribution</h3>
          <TaskStatusPieChart data={taskStatusData} />
        </Card>
      </div>

      <Card accent="blue">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Completed Tasks Over Time (Last 7 Days)
        </h3>
        <CompletedTasksLineChart data={productivityData} />
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="mb-0" accent="blue">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">📅 Upcoming Deadlines</h3>
          {upcomingDeadlines.length === 0 ? (
            <p className="text-gray-500">No upcoming deadlines.</p>
          ) : (
            <ul className="space-y-2">
              {upcomingDeadlines.map((item) => (
                <li
                  key={item.taskId}
                  className="bg-gray-50 border border-gray-200 rounded-lg p-3 hover:border-pink-200 transition"
                >
                  <p className="font-medium text-gray-800">{item.title}</p>
                  <p className="text-sm text-gray-500">
                    {item.projectName} — Due {item.dueDate?.split("T")[0]}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="mb-0" accent="pink">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">✨ Recent Activity</h3>
          {recentActivities.length === 0 ? (
            <p className="text-gray-500">No recent activity yet.</p>
          ) : (
            <ul className="space-y-2">
              {recentActivities.map((activity, index) => (
                <li
                  key={index}
                  className="border-l-4 border-pink-300 bg-gray-50 rounded-r-lg pl-3 py-2 text-sm"
                >
                  <p className="text-gray-700">{activity.text}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(activity.date).toLocaleDateString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, accent, neutral }) {
  const pastel = {
    pink: "bg-pink-100 text-pink-800 border-pink-200",
    blue: "bg-blue-100 text-blue-800 border-blue-200",
  };

  const style = neutral
    ? "bg-white text-gray-800 border-gray-200"
    : pastel[accent] || pastel.blue;

  return (
    <div
      className={`${style} rounded-lg border p-6 flex flex-col items-center shadow-sm hover:shadow-md transition-shadow`}
    >
      <span className="text-3xl mb-2">{icon}</span>
      <span className="text-4xl font-bold">{value}</span>
      <span className="mt-2 text-base font-medium">{label}</span>
    </div>
  );
}

export default Dashboard;
