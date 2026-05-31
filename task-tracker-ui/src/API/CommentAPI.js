import axios from "axios";

const API_URL = "http://localhost:5180/api/Comments";

// Fetch comments that may be filtered by taskId
export const fetchComments = async (taskId) => {
  const url = taskId ? `${API_URL}?taskId=${taskId}` : API_URL;
  const response = await axios.get(url);
  return response.data;
};

// Create a new comment
export const addComment = async (comment) => {
  const response = await axios.post(API_URL, comment);
  return response.data;
};

// Delete a comment by ID
export const deleteComment = async (commentId) => {
  await axios.delete(`${API_URL}/${commentId}`);
};
