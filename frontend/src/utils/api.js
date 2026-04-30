import axios from "axios";

const API = axios.create({
  baseURL: "/api",
});

// Add token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (data) => API.post("/auth/register", data),
  login: (data) => API.post("/auth/login", data),
  getMe: () => API.get("/auth/me"),
  updateProfile: (data) => API.put("/auth/profile", data),
  oauthLogin: (data) => API.post("/auth/oauth", data),
};

export const mentorAPI = {
  getMentors: () => API.get("/mentors"),
  getMentorById: (id) => API.get(`/mentors/${id}`),
  createMentor: (data) => API.post("/mentors", data),
  updateMentorProfile: (data) => API.put("/mentors/profile", data),
};

export const mentorshipAPI = {
  createRequest: (data) => API.post("/mentorship", data),
  getRequests: () => API.get("/mentorship"),
  updateRequest: (id, data) => API.put(`/mentorship/${id}`, data),
};

export const jobAPI = {
  getJobs: () => API.get("/jobs"),
  getJobById: (id) => API.get(`/jobs/${id}`),
  createJob: (data) => API.post("/jobs", data),
  applyForJob: (id) => API.post(`/jobs/${id}/apply`),
  updateApplicationStatus: (jobId, userId, status) => API.put(`/jobs/${jobId}/applications/${userId}/status`, { status }),
};

export const eventAPI = {
  getEvents: () => API.get("/events"),
  getEventById: (id) => API.get(`/events/${id}`),
  createEvent: (data) => API.post("/events", data),
  registerForEvent: (id) => API.post(`/events/${id}/register`),
};

export const notificationAPI = {
  getNotifications: () => API.get("/notifications"),
  markAsRead: (id) => API.put(`/notifications/${id}/read`),
  markAllAsRead: () => API.put("/notifications/read-all"),
};

export const uploadAPI = {
  uploadImage: (formData) => API.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }),
};

export const chatAPI = {
  getConversations: () => API.get("/chat/conversations"),
  getMessages: (conversationId) => API.get(`/chat/conversations/${conversationId}/messages`),
  createConversation: (otherUserId) => API.post("/chat/conversations", { otherUserId }),
};

export const postAPI = {
  getPosts: () => API.get("/posts"),
  createPost: (data) => API.post("/posts", data),
  toggleLike: (id) => API.post(`/posts/${id}/like`),
  addComment: (id, content) => API.post(`/posts/${id}/comments`, { content }),
};

export const meetingAPI = {
  getMeetings: () => API.get("/meetings"),
  createMeeting: (data) => API.post("/meetings", data),
};

export const aiAPI = {
  generateText: (prompt, type) => API.post("/ai/generate", { prompt, type }),
  matchMentors: () => API.post("/ai/match"),
};

export default API;
