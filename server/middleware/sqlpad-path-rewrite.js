/**
 * Middleware to rewrite SQLPad paths
 * Transforms /sqlpad/{version_id}/foo → /foo  (named prefix)
 * Transforms /{numeric_id}/foo        → /foo  (numeric ID prefix)
 *
 * Also sets req.sqlpadPathPrefix so the HTML catch-all can inject the
 * correct base URL into the served index page, ensuring asset URLs like
 * /assets/... become /{id}/assets/... and still resolve correctly.
 */
function sqlpadPathRewrite(req, res, next) {
  const originalUrl = req.url;

  let prefix = null;
  let rest = null;

  if (originalUrl.startsWith("/sqlpad/")) {
    // /sqlpad/{version_id}     → /
    // /sqlpad/{version_id}/foo → /foo
    const match = originalUrl.match(/^(\/sqlpad\/[^/]+)(\/.*)?$/);
    if (match) {
      prefix = match[1]; // e.g. "/sqlpad/1157"
      rest = match[2] || "/";
    }
  } else {
    // /{numeric_id}     → /
    // /{numeric_id}/foo → /foo
    const match = originalUrl.match(/^(\/\d+)(\/.*)?$/);
    if (match) {
      prefix = match[1]; // e.g. "/1157"
      rest = match[2] || "/";
    }
  }

  if (prefix !== null) {
    req.sqlpadPathPrefix = prefix;
    req.log.info(`Rewriting SQLPad path from ${originalUrl} → ${rest}`);
    req.url = rest;
  }

  next();
}

export default sqlpadPathRewrite;
