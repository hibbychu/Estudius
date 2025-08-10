// src/state/authStore.ts
import { create } from "zustand";
const defaultAvatar = "assets/icons/user.png";

interface User {
  name: string;
  avatar: string;
}

interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
}

// Load initial state from localStorage
const storedUser = localStorage.getItem("user");
const storedToken = localStorage.getItem("token");

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: !!storedToken,
  user: storedUser
    ? {
        ...JSON.parse(storedUser),
        avatar: JSON.parse(storedUser).avatar || defaultAvatar,
      }
    : null,
  token: storedToken || null,

  login: (user, token) => {
    const userWithAvatar = { ...user, avatar: user.avatar || defaultAvatar };
    localStorage.setItem("user", JSON.stringify(userWithAvatar));
    localStorage.setItem("token", token);

    set({
      isLoggedIn: true,
      user: userWithAvatar,
      token,
    });
  },

  logout: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    set({
      isLoggedIn: false,
      user: null,
      token: null,
    });
  },
}));
