import { reactive } from 'vue';
import type { AuthUser } from '@/types';
import { clearAuthStorage } from '@/api/client';
import {
  fetchCurrentUser as fetchCurrentUserRequest,
  login as loginRequest,
  logout as logoutRequest,
  signup as signupRequest
} from '@/api/auth';
import type { AuthRole } from '@/config/auth';

const STORAGE_KEY = 'agilevendor.auth.user';

const readStoredUser = (): AuthUser | null => {
  const storedValue = localStorage.getItem(STORAGE_KEY);

  if (!storedValue) {
    return null;
  }

  try {
    return JSON.parse(storedValue) as AuthUser;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
};

const persistUser = (user: AuthUser | null) => {
  if (!user) {
    localStorage.removeItem(STORAGE_KEY);
    return;
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
};

export const authState = reactive({
  user: readStoredUser() as AuthUser | null,
  initialized: false
});

let hydrationPromise: Promise<AuthUser | null> | null = null;

const setUser = (user: AuthUser | null) => {
  authState.user = user;
  persistUser(user);
};

export const ensureAuthLoaded = async () => {
  if (authState.initialized) {
    return authState.user;
  }

  if (hydrationPromise) {
    return hydrationPromise;
  }

  hydrationPromise = (async () => {
    try {
      const user = await fetchCurrentUserRequest();
      setUser(user);
      return user;
    } catch {
      setUser(null);
      clearAuthStorage();
      return null;
    } finally {
      authState.initialized = true;
      hydrationPromise = null;
    }
  })();

  return hydrationPromise;
};

export const login = async (payload: { email: string; password: string; role?: AuthRole }) => {
  const user = await loginRequest(payload);
  authState.initialized = true;
  setUser(user);
  return user;
};

export const signup = async (payload: {
  name: string;
  email: string;
  password: string;
  role: AuthRole;
}) => {
  const user = await signupRequest(payload);
  authState.initialized = true;
  setUser(user);
  return user;
};

export const logout = async () => {
  try {
    await logoutRequest();
  } finally {
    authState.initialized = true;
    setUser(null);
  }
};
