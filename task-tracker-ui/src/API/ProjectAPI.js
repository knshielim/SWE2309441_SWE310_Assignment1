import axios from "axios";

const API_URL = "http://localhost:5180/api/Projects";

// Fetch all projects
export const fetchProjects = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
};

// Fetch a specific project by ID
export const fetchProjectById = async (projectId) => {
  try {
    const response = await axios.get(`${API_URL}/${projectId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching project:", error);
    throw error;
  }
};

// Create a new project
export const addProject = async (project) => {
  try {
    const response = await axios.post(API_URL, project);
    return response.data;
  } catch (error) {
    console.error("Error adding project:", error);
    throw error;
  }
};

// Update an existing project
export const editProject = async (projectId, updatedProject) => {
  try {
    const response = await axios.put(`${API_URL}/${projectId}`, updatedProject);
    return response.data;
  } catch (error) {
    console.error("Error editing project:", error);
    throw error;
  }
};

// Delete a project by ID
export const deleteProject = async (projectId) => {
  try {
    const response = await axios.delete(`${API_URL}/${projectId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting project:", error);
    throw error;
  }
};
