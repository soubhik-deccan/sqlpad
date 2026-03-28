import { api } from './api';

function useAppContext() {
  let { data } = api.useAppInfo();

  const { config, currentUser, version } = data || {};

  if (!config) {
    return {};
  }

  return { config, currentUser, version };
}

export default useAppContext;
