/**
 * Middleware to rewrite SQLPad paths
 * Transforms /sqlpad/{session_id} → / and /sqlpad/{session_id}/foo → /foo
 */
function sqlpadPathRewrite(req, res, next) {
  const path = req.path;

  if (path.startsWith("/sqlpad/")) {
    const segments = path.split("/").filter(Boolean);

    // ['sqlpad', '{session_id}', ...rest]

    let newPath = "/";

    if (segments.length > 2) {
      newPath = "/" + segments.slice(2).join("/");
    }

    req.log.info(`Rewriting SQLPad path from ${path} → ${newPath}`);

    req.url = newPath;
    req.path = newPath;
  }

  next();
}

export default sqlpadPathRewrite;
