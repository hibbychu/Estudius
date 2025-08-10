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

// Load initial state from sessionStorage
const storedUser = sessionStorage.getItem("user");
const storedToken = sessionStorage.getItem("token");

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
    sessionStorage.setItem("user", JSON.stringify(userWithAvatar));
    sessionStorage.setItem("token", token);

    set({
      isLoggedIn: true,
      user: userWithAvatar,
      token,
    });
  },

  logout: () => {
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");

    set({
      isLoggedIn: false,
      user: null,
      token: null,
    });
  },
}));
