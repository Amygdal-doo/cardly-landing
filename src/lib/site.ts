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
/**
 * The account pages moved to the root of the product host. They were a /app
 * section of the marketing site until the two were split; every one of those
 * addresses still resolves, but as a redirect, so linking to the old shape
 * costs a needless hop.
 */
export const DASHBOARD_URL = APP_URL;
export const SETTINGS_URL = `${APP_URL}/settings`;
export const COMPANY_URL = `${APP_URL}/company`;
export const DELETE_ACCOUNT_URL = `${APP_URL}/delete-account`;

/** Deep-link scheme the mobile app registers. See the mobile repo's app.json. */
export const APP_SCHEME = 'cardly';

/**
 * Contact address.
 *
 * One mailbox on the product's own domain. It both receives and sends: the
 * Supabase project authenticates as this address and SPF, DKIM and DMARC are
 * published for usecardly.app, so mail from it is authenticated rather than
 * arriving on a domain nothing vouches for.
 */
export const CONTACT_EMAIL = 'support@usecardly.app';

/**
 * The store listings.
 *
 * iOS is addressed by its App Store id — the `ascAppId` in the mobile repo's
 * eas.json — not by a slug. `apps.apple.com/app/cardly` was a guess at a slug
 * Apple never assigned, and it 404s. The id form is the one that always works.
 */
export const STORE_LINKS = {
  ios: 'https://apps.apple.com/app/id6797317769',
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
