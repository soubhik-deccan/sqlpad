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

// Derive the /sqlpad/{version_id} prefix from the current URL once at startup,
// before any API calls or React renders happen. All subsequent API requests
// will internally prepend this prefix — the browser URL itself is managed
// by React Router using this as its basename.
//
// Always normalises to /sqlpad/{version_id} form so requests are routed
// consistently, regardless of which URL form was used to reach the page:
//   /sqlpad/1157/...  →  baseUrl = "/sqlpad/1157"
//   /1157/...         →  baseUrl = "/sqlpad/1157"  (normalised)
(function initBaseUrl() {
  const path = window.location.pathname;
  const sqlpadMatch = path.match(/^\/sqlpad\/([^/]+)/);
  if (sqlpadMatch) {
    baseUrl(`/sqlpad/${sqlpadMatch[1]}`);
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
