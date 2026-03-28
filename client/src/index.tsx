import localforage from 'localforage';
import './css/reset.css';
import '@reach/dialog/styles.css';
import '@reach/menu-button/styles.css';
import React from 'react';
import { SWRConfig } from 'swr';
import { MessageDisplayer } from './common/message';
import './css/index.css';
import './css/react-split-pane.css';
import './css/vendorOverrides.css';
import Routes from './Routes';
import swrFetcher from './utilities/swr-fetcher';
import { createRoot } from 'react-dom/client';
import baseUrl from './utilities/baseUrl';

// Derive the /sqlpad/{version_id} prefix from the current URL before any API
// calls are made. This ensures every request (including early ones like
// URL-based auth) is sent to the correct path-prefixed route on the backend.
//
// Supports both URL forms and normalises to /sqlpad/{version_id}:
//   /sqlpad/1157/...  →  /sqlpad/1157
//   /1157/...         →  /sqlpad/1157  (numeric-only prefix)
(function initBaseUrl() {
  const path = window.location.pathname;
  const sqlpadMatch = path.match(/^(\/sqlpad\/[^/]+)/);
  if (sqlpadMatch) {
    baseUrl(sqlpadMatch[1]);
    return;
  }
  const numericMatch = path.match(/^\/(\d+)/);
  if (numericMatch) {
    baseUrl(`/sqlpad/${numericMatch[1]}`);
  }
})();

declare global {
  interface Window {
    localforage: LocalForage;
  }
}

window.localforage = localforage;

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <SWRConfig
    value={{
      fetcher: swrFetcher,
    }}
  >
    <Routes />
    <MessageDisplayer />
  </SWRConfig>
);
