import axios from "axios";

const API_URL = "http://localhost:5180/api/projectupdates";

// Fetch project updates that may be filtered by projectId
export const fetchProjectUpdates = async (projectId = null) => {
  const url = projectId ? `${API_URL}?projectId=${projectId}` : API_URL;
  const response = await axios.get(url);
  return response.data;
};

// Fetch a specific project update by ID
export const fetchProjectUpdateById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

// Create a new project update
export const createProjectUpdate = async (update) => {
  const response = await axios.post(API_URL, update);
  return response.data;
};

// Update an existing project update
export const updateProjectUpdate = async (id, update) => {
  const response = await axios.put(`${API_URL}/${id}`, update);
  return response.data;
};

// Delete a project update by ID
export const deleteProjectUpdate = async (id) => {
  await axios.delete(`${API_URL}/${id}`);
};
