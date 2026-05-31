import axios from "axios";

const API_URL = "http://localhost:5180/api/Tasks";

// Fetch tasks with optional filters (status, priority, projectId, search)
export const fetchTasks = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.status && filters.status !== "All") params.append("status", filters.status);
    if (filters.priority && filters.priority !== "All") params.append("priority", filters.priority);
    if (filters.projectId) params.append("projectId", filters.projectId);
    if (filters.search?.trim()) params.append("search", filters.search.trim());

    const query = params.toString();
    const url = query ? `${API_URL}?${query}` : API_URL;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};

// Fetch a specific task by ID
export const fetchTaskById = async (taskId) => {
  try {
    const response = await axios.get(`${API_URL}/${taskId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching task:", error);
    throw error;
  }
};

// Create a new task
export const addTask = async (task) => {
  try {
    const response = await axios.post(API_URL, task);
    return response.data;
  } catch (error) {
    console.error("Error adding task:", error);
    throw error;
  }
};

// Update an existing task
export const editTask = async (taskId, updatedTask) => {
  try {
    const response = await axios.put(`${API_URL}/${taskId}`, updatedTask);
    return response.data;
  } catch (error) {
    console.error("Error editing task:", error);
    throw error;
  }
};

// Delete a task by ID
export const deleteTask = async (taskId) => {
  try {
    const response = await axios.delete(`${API_URL}/${taskId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};
