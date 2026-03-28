import '../typedefs.js';
import packageJson from '../server-package-json.cjs';
import wrap from '../lib/wrap.js';
import express from 'express';
const router = express.Router();

/**
 * @param {Req} req
 * @param {Res} res
 */
async function getApp(req, res) {
  const { config } = req;

  const currentUser =
    req.isAuthenticated() && req.user
      ? {
          id: req.user.id,
          email: req.user.email,
          role: req.user.role,
          name: req.user.name,
          ldapId: req.user.ldapId,
        }
      : undefined;

  // When accessed via a path-prefixed URL (e.g. /1157/api/app), the
  // path-rewrite middleware stores the original prefix on req.sqlpadPathPrefix.
  // Return it as baseUrl so the frontend prefixes all API calls correctly
  // (e.g. /1157/api/signin instead of /api/signin).
  const effectiveBaseUrl = req.sqlpadPathPrefix || config.get('baseUrl');

  return res.utils.data({
    currentUser,
    config: {
      allowCsvDownload: config.get('allowCsvDownload'),
      baseUrl: effectiveBaseUrl,
      defaultConnectionId: config.get('defaultConnectionId'),
      editorWordWrap: config.get('editorWordWrap'),
      googleAuthConfigured: Boolean(config.googleAuthConfigured()),
      localAuthConfigured: !config.get('userpassAuthDisabled'),
      publicUrl: config.get('publicUrl'),
      samlConfigured: Boolean(config.get('samlEntryPoint')),
      samlLinkHtml: config.get('samlLinkHtml'),
      ldapConfigured: config.get('ldapAuthEnabled'),
      ldapRolesConfigured: Boolean(
        config.get('ldapRoleAdminFilter') || config.get('ldapRoleEditorFilter')
      ),
      oidcConfigured: config.oidcConfigured(),
      oidcLinkHtml: config.get('oidcLinkHtml'),
      showServiceTokensUI: Boolean(config.get('serviceTokenSecret')),
    },
    version: packageJson.version,
  });
}

// NOTE: this route needs a wildcard because it is fetched as a relative url
// from the front-end. The static SPA does not know if sqlpad is mounted at
// the root of a domain or if there is a base-url provided in the config
router.get('*/api/app', wrap(getApp));

export default router;
