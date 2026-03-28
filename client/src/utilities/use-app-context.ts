import baseUrl from './baseUrl';
import { api } from './api';

function useAppContext() {
  let { data } = api.useAppInfo();

  const { config, currentUser, version } = data || {};

  if (!config) {
    return {};
  }

  // Only let the server override baseUrl when it provides a real value.
  // If it returns "" (e.g. default config with no baseUrl set), keep the
  // prefix that was derived from window.location at startup in index.tsx.
  if (config.baseUrl) {
    baseUrl(config.baseUrl);
  }

  return { config, currentUser, version };
}

export default useAppContext;
