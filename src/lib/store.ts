import { STORE_LINKS } from './site';

/**
 * Which app store, if any, this device has.
 *
 * "Get Cardly" used to be a link to the sign-up form, shown to everyone. On a
 * phone that is the wrong offer: the phone is where the app runs, and asking
 * someone to fill in an email form on a 390pt keyboard when the store is one
 * tap away loses them. On a desktop it is the *only* sensible offer, because
 * there is no store to send them to.
 *
 * So the button is two buttons, and this decides which one a visitor sees.
 *
 * Deliberately user-agent sniffing rather than a media query. A narrow browser
 * window on a laptop is not a phone, and offering it the App Store is a dead
 * end; what matters is whether the device has a store at all, which is a fact
 * about the device and not about the viewport.
 */
export type DeviceStore = {
  platform: 'ios' | 'android';
  href: string;
  /** For an aria-label, where "Get Cardly" alone does not say where it goes. */
  label: string;
};

export function deviceStore(): DeviceStore | null {
  if (typeof navigator === 'undefined') return null;
  const ua = navigator.userAgent || '';

  // Android is tested first: its user-agent string also contains "Linux" and
  // "Mobile Safari", so anything matching on those alone matches it too.
  if (/android/i.test(ua)) {
    return { platform: 'android', href: STORE_LINKS.android, label: 'Get Cardly on Google Play' };
  }

  // iPadOS 13 and later report a desktop Mac user-agent by default, so the
  // /iphone|ipad/ test misses every iPad. maxTouchPoints is what separates an
  // iPad from a MacBook: a trackpad reports 0.
  const isIOS =
    /iphone|ipad|ipod/i.test(ua) || (/macintosh/i.test(ua) && navigator.maxTouchPoints > 1);
  if (isIOS) {
    return { platform: 'ios', href: STORE_LINKS.ios, label: 'Download Cardly on the App Store' };
  }

  return null;
}
