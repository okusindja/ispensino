/* eslint-disable @typescript-eslint/no-explicit-any */

import useSWR, { SWRConfiguration } from 'swr';

import { fetcher, fetcherWithCredentials } from '@/constants/fetchers';

export const useAuthenticatedSWR = <Data = any, Error = any>(
  url: string | null,
  config?: SWRConfiguration<Data, Error>
) => {
  return useSWR<Data, Error>(url, fetcherWithCredentials, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
    ...config,
  });
};

export const usePublicSWR = <Data = any, Error = any>(
  url: string | null,
  config?: SWRConfiguration<Data, Error>
) => {
  return useSWR<Data, Error>(url, fetcher, config);
};

export const mutateWithAuth = async <T = any>(
  url: string,
  data: T,
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'POST'
) => {
  return fetcherWithCredentials(url, {
    method,
    body: JSON.stringify(data),
  });
};
