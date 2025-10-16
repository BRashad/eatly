import axios from 'axios';

import { CONFIG } from '@constants/app-config';

export const apiClient = axios.create({
  baseURL: CONFIG.API_BASE_URL,
  timeout: CONFIG.REQUEST_TIMEOUT,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);
