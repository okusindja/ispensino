import useSWR, { SWRConfiguration } from 'swr';

import { fetcher, fetcherWithCredentials } from '@/constants/fetchers';

export const useAuthenticatedSWR = <Data = unknown, Error = unknown>(
  url: string | null,
  config?: SWRConfiguration<Data, Error>
) => {
  return useSWR<Data, Error>(url, fetcherWithCredentials, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
    ...config,
  });
};

export const usePublicSWR = <Data = unknown, Error = unknown>(
  url: string | null,
  config?: SWRConfiguration<Data, Error>
) => {
  return useSWR<Data, Error>(url, fetcher, config);
};

export const mutateWithAuth = async <T = unknown>(
  url: string,
  data: T,
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'POST'
) => {
  return fetcherWithCredentials(url, {
    method,
    body: JSON.stringify(data),
  });
};
