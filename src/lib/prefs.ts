/**
 * Preferences that follow you between the website and the app.
 *
 * The two live on different subdomains — www.usecardly.app and
 * app.usecardly.app — and localStorage is scoped to an origin, not to a
 * registrable domain. So a theme chosen on the marketing site was invisible to
 * the product and the other way round, however identical the key names were.
 * Naming them the same made the two stores look shared without making them so.
 *
 * A cookie on `.usecardly.app` is visible to both, so each preference is
 * written twice: localStorage for the same-origin read (synchronous, survives
 * a cookie the browser declines to keep) and the cookie as the thing that
 * actually crosses. Reads prefer localStorage and fall back to the cookie,
 * copying it back as they go, so a first visit to the other subdomain adopts
 * the choice once and reads locally after that.
 *
 * Only put things here that both sides genuinely share and that nobody would
 * mind travelling in a request header — a cookie is sent on every request to
 * the domain. The theme qualifies. Which card you are does not: the website
 * has no use for it, and it would ride along on every asset fetch.
 *
 * This file is deliberately duplicated in the product's repo
 * (cardly-landing-astro, which builds app.usecardly.app). The two sites are
 * separate codebases on separate subdomains, and the only thing that has to
 * agree between them is the contract below: the key name, the default, and the
 * cookie's Domain. Sharing the file would mean a package neither site has
 * today; sharing the contract costs a comment.
 */

/** A year. Long enough that a preference is not re-asked; not permanent. */
const MAX_AGE = 60 * 60 * 24 * 365;

/**
 * `.usecardly.app` in production, nothing anywhere else.
 *
 * A Domain attribute naming a host the browser is not on is rejected outright,
 * which would silently drop the cookie on localhost and on preview builds. Omit
 * it there and the cookie is host-only, which is correct: there is nothing to
 * share with.
 */
function cookieDomain(): string {
  const h = location.hostname;
  return h === 'usecardly.app' || h.endsWith('.usecardly.app') ? '; Domain=.usecardly.app' : '';
}

function readCookie(name: string): string | null {
  const prefix = `${encodeURIComponent(name)}=`;
  for (const part of document.cookie.split('; ')) {
    if (part.startsWith(prefix)) {
      try {
        return decodeURIComponent(part.slice(prefix.length));
      } catch {
        return null;
      }
    }
  }
  return null;
}

/** Read a shared preference, adopting the cookie if this origin has not seen it. */
export function readPref(key: string): string | null {
  let local: string | null = null;
  try {
    local = localStorage.getItem(key);
  } catch {
    /* private mode — the cookie may still answer */
  }
  if (local !== null) return local;

  const shared = readCookie(key);
  if (shared !== null) {
    try {
      localStorage.setItem(key, shared);
    } catch {
      /* fine — the cookie keeps answering */
    }
  }
  return shared;
}

/** Write a shared preference to both stores. */
export function writePref(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* private mode — the cookie still carries it */
  }
  // SameSite=Lax rather than Strict: following a link from the website to the
  // app is a cross-site navigation, and Strict would withhold the cookie on
  // exactly the journey this exists for.
  const secure = location.protocol === 'https:' ? '; Secure' : '';
  document.cookie =
    `${encodeURIComponent(key)}=${encodeURIComponent(value)}` +
    `; Path=/; Max-Age=${MAX_AGE}; SameSite=Lax${secure}${cookieDomain()}`;
}

/** Forget a shared preference on both stores. */
export function clearPref(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    /* nothing to do */
  }
  document.cookie =
    `${encodeURIComponent(key)}=; Path=/; Max-Age=0; SameSite=Lax${cookieDomain()}`;
}

/** The preferences that travel. One name, so neither side can drift. */
export const PREF_THEME = 'cardly.theme';

/** No choice made. Both sides start here, and both mean the same by it. */
export const DEFAULT_THEME = 'system';
