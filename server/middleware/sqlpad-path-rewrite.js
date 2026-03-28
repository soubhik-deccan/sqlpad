/**
 * Middleware to rewrite SQLPad paths
 * Transforms /sqlpad/{version_id} → / and /sqlpad/{version_id}/foo → /foo
 */
function sqlpadPathRewrite(req, res, next) {
  const originalUrl = req.url;

  if (originalUrl.startsWith("/sqlpad/")) {
    // Strip /sqlpad/{version_id} prefix, leaving the rest (e.g. /foo or "")
    // /sqlpad/{version_id}     → /
    // /sqlpad/{version_id}/foo → /foo
    const rest = originalUrl.replace(/^\/sqlpad\/[^/]+/, "");
    const newPath = rest || "/";

    req.log.info(`Rewriting SQLPad path from ${originalUrl} → ${newPath}`);

    req.url = newPath;
  }
  
  next();
}

export default sqlpadPathRewrite;
