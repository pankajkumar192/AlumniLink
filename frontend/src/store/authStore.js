import { create } from "zustand";
import { authAPI } from "../utils/api";

const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem("token") || null,
  isAuthenticated: !!localStorage.getItem("token"),
  isLoading: false,
  isNewOAuthUser: false, // true when OAuth user logs in for the first time
  error: null,

  register: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await authAPI.register(credentials);
      localStorage.setItem("token", data.token);
      set({
        user: data.user,
        token: data.token,
        isAuthenticated: true,
        isLoading: false,
      });
      return data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Registration failed";
      set({ error: errorMsg, isLoading: false });
      throw error;
    }
  },

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await authAPI.login(credentials);
      localStorage.setItem("token", data.token);
      set({
        user: data.user,
        token: data.token,
        isAuthenticated: true,
        isLoading: false,
      });
      return data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Login failed";
      set({ error: errorMsg, isLoading: false });
      throw error;
    }
  },

  // OAuth login (Google / GitHub via Firebase)
  oauthLogin: async (idToken, provider = "google") => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await authAPI.oauthLogin({ idToken, provider });
      localStorage.setItem("token", data.token);
      set({
        user: data.user,
        token: data.token,
        isAuthenticated: true,
        isNewOAuthUser: data.isNewUser === true, // flag for onboarding redirect
        isLoading: false,
      });
      return data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || "OAuth login failed";
      set({ error: errorMsg, isLoading: false });
      throw error;
    }
  },

  // Called after onboarding is completed – clears the new-user flag
  clearNewOAuthUser: () => set({ isNewOAuthUser: false }),

  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, token: null, isAuthenticated: false, isNewOAuthUser: false });
  },

  getMe: async () => {
    try {
      const { data } = await authAPI.getMe();
      set({ user: data.data });
      return data.data;
    } catch (error) {
      // Only clear auth on explicit 401 (unauthorized), not network errors
      if (error.response?.status === 401) {
        set({ isAuthenticated: false, token: null });
        localStorage.removeItem("token");
      }
    }
  },
}));

export default useAuthStore;
