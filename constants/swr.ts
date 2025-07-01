import { getAuth } from 'firebase/auth';

export const fetcherWithCredentials = async (url: string) => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) throw new Error('User not logged in');
  const token = await user.getIdToken();
  const res = await fetch(url, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  return res.json();
};

export const fetcher = async (url: string, options?: RequestInit) => {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const error = new Error('An error occurred');
    const data = await res.json().catch(() => ({}));
    error.message = data.error || 'An error occurred';
    throw error;
  }

  return res.json();
};
