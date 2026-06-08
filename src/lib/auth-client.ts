import { createAuthClient } from 'better-auth/react';
import { anonymousClient } from 'better-auth/client/plugins';

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000', // Ganti dengan URL backend jika berbeda
  fetchOptions: {
    customFetchImpl: async (url: string | Request | URL, init?: RequestInit) => {
      return fetch(url, { ...init, credentials: 'include' });
    },
  },
  plugins: [anonymousClient()],
});

export const { signIn, signUp, useSession, signOut } = authClient;
