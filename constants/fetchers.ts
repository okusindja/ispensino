/* eslint-disable @typescript-eslint/no-explicit-any */

import { getAuth } from 'firebase/auth';

// lib/fetchers.ts
export const fetcherWithCredentials = async <T = any>(
  url: string,
  options: RequestInit = {
    method: 'GET',
  }
): Promise<T> => {
  try {
    const auth = getAuth();
    await auth.authStateReady();
    const user = auth.currentUser;

    if (!user) {
      throw new Error('User not authenticated');
    }

    const token = await user.getIdToken();
    const headers = new Headers(options.headers || {});
    headers.set('Authorization', `Bearer ${token}`);
    headers.set('Content-Type', 'application/json');

    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error = new Error(
        errorData.message || 'Request failed'
      ) as Error & { status?: number };
      error.status = response.status;
      throw error;
    }

    return response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

export const fetcher = async <T = any>(
  url: string,
  options: RequestInit = { method: 'GET' }
): Promise<T> => {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error = new Error(errorData.message || 'Request failed') as Error & {
      status?: number;
    };
    error.status = response.status;
    throw error;
  }

  return response.json();
};
