import type { AxiosRequestConfig } from 'axios';

import axios from 'axios';

import axiosInstance from 'src/utils/axios';

// ----------------------------------------------------------------------

/**
 * Custom Axios instance for Orval-generated API clients
 * This function is used by Orval as a mutator to handle all API requests
 * It integrates with the existing axios instance that has auth interceptors
 */
export function customInstance<T>(config: AxiosRequestConfig, options?: AxiosRequestConfig): Promise<T> {
  const source = axios.CancelToken.source();

  const promise = axiosInstance({
    ...config,
    ...options,
    cancelToken: source.token,
  }).then(({ data }) => data);

  // @ts-ignore
  promise.cancel = () => {
    source.cancel('Query was cancelled');
  };

  return promise;
}

export default customInstance;
