import { getAuth } from 'firebase/auth';

export const fetcherWithCredentials = async (
  url: string,
  options: RequestInit = {}
) => {
  const auth = getAuth();
  await auth.authStateReady();

  const user = auth.currentUser;
  if (!user) {
    throw new Error('User not authenticated');
  }

  const token = await user.getIdToken(true);

  const headers = new Headers(options.headers || {});
  headers.set('Authorization', `Bearer ${token}`);

  if (options.body) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.error || `Request failed with status ${response.status}`
    );
  }

  return response.json();
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
