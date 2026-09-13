/**
 * The handful of facts the marketing pages state out loud.
 *
 * Trimmed copy of the same file in cardly-landing-astro. The auth helpers that
 * live there — AUTH_ORIGIN, AUTH_CALLBACK_URL, INVITE_URL — are deliberately
 * absent: they exist to bring a browser back to a Supabase session, and this
 * site never opens one. Leaving them here would be an invitation to import
 * them, and the first page that did would pull the Supabase client into a
 * bundle that currently has none.
 */

/** Canonical origin of the marketing site. No trailing slash. */
export const SITE_URL = 'https://www.usecardly.app';

/**
 * Where the product lives, now that it is a separate deployment.
 *
 * Every control that used to be an in-site link — "Sign in", "Open dashboard",
 * the invite flow — crosses a domain boundary from here. Spelled out once so
 * that moving the app again is one edit rather than a grep, and so no page
 * quietly keeps a relative `/app` href that would 404 on this host.
 */
export const APP_URL = 'https://app.usecardly.app';

export const SIGN_IN_URL = `${APP_URL}/signin`;
export const DASHBOARD_URL = `${APP_URL}/app`;
export const DELETE_ACCOUNT_URL = `${APP_URL}/delete-account`;

/** Deep-link scheme the mobile app registers. See the mobile repo's app.json. */
export const APP_SCHEME = 'cardly';

/**
 * Contact address.
 *
 * One real mailbox rather than four aliases on a domain that does not receive
 * mail. This is the Google Workspace account that already sends the product's
 * auth email, so it is known to work.
 */
export const CONTACT_EMAIL = 'info@amygdal.com';

export const STORE_LINKS = {
  ios: 'https://apps.apple.com/app/cardly',
  android: 'https://play.google.com/store/apps/details?id=com.amygdal.usecardlyapp',
} as const;

/**
 * A public profile URL.
 *
 * Public profiles are served by the product, not by this site, but marketing
 * copy quotes the shape of the link often enough that spelling it by hand
 * drifted. It points at the canonical marketing origin because that is what is
 * printed on cards and wallet passes today; the product handles the path.
 */
export const profileUrl = (userId: string) => `${SITE_URL}/profile/${userId}`;

/** The short link that goes on a QR and gets read aloud: /c/<id>. */
export const cardUrl = (cardId: string) => `${SITE_URL}/c/${cardId}`;
