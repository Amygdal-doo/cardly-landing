// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

/**
 * The marketing site.
 *
 * Split out of cardly-landing-astro, which serves the signed-in product at
 * /app and carries a Supabase client to do it. Marketing pages paid for that
 * client on every visit: bundle downloaded, parsed and executed so a navbar
 * could decide between "Sign in" and "Dashboard". Nothing here needs a
 * session, so nothing here loads one — these pages ship no application
 * JavaScript at all beyond the small progressive-enhancement script on
 * /contact.
 *
 * That is the whole reason this project exists separately. A crawler's budget
 * and a phone on a bad connection are spent on the same bytes, and marketing
 * is the one surface where both actually matter.
 */
export default defineConfig({
  // Canonical origin. Astro builds canonical tags, Open Graph URLs and the
  // sitemap from this, so it has to be the domain that serves these pages —
  // www.usecardly.app. The product moved to app.usecardly.app; see APP_URL in
  // src/lib/site.ts for every link that crosses over.
  site: 'https://www.usecardly.app',

  integrations: [
    sitemap({
      // Pages that exist only to be redirects or error states have no business
      // in a sitemap: submitting them invites "Page with redirect" and
      // "Not found (404)" rows in Search Console that never resolve.
      filter: (page) => !page.includes('/delete-account'),
    }),
  ],

  // Astro emits dist/<name>/index.html for each page, and `serve` resolves
  // extensionless URLs against that with cleanUrls. Keeping the trailing
  // slash off means /privacy and /privacy/ do not both become indexable
  // addresses for one page.
  trailingSlash: 'never',

  build: {
    // One stylesheet in the head rather than several, and no <style> blocks
    // duplicated per page. Fewer round trips before first paint.
    inlineStylesheets: 'auto',
  },

  // These are the dev-server and preview redirects. In a static build Astro
  // cannot emit a real 301 — it writes an HTML page carrying a meta refresh,
  // which answers 200 and which search engines treat as a soft redirect at
  // best. public/serve.json declares the same list again as true 301s, and
  // `serve` matches redirects before it looks for a file, so production never
  // reaches the meta-refresh pages. Both lists have to be edited together.
  redirects: {
    // Account deletion stays with the product: it needs a signed-in Supabase
    // session to actually delete anything. The public URL has been handed to
    // Apple, so it has to keep resolving from this domain — as a redirect
    // rather than a copy, because two pages describing account deletion is
    // how one of them goes stale.
    '/delete-account': 'https://app.usecardly.app/delete-account',

    // Addresses that were live on this domain before the split. Left as
    // redirects so shared links and anything already indexed still land.
    //
    // They point at the *current* shape, not the one that was live when the
    // split happened: the account pages became the root of the product host,
    // so '/app/settings' would answer and then immediately redirect again.
    '/app': 'https://app.usecardly.app/',
    '/signin': 'https://app.usecardly.app/signin',
    '/invite': 'https://app.usecardly.app/invite',
    '/auth/callback': 'https://app.usecardly.app/auth/callback',
    '/dashboard': 'https://app.usecardly.app/',
    '/settings': 'https://app.usecardly.app/settings',

    // Public pages, and the reason this list is not optional. A card carries
    // /c/<id>; a wallet pass bakes /profile/<id> into its QR; the mobile post
    // editor loads /embed/post-editor from this origin. None of those can be
    // reissued once they are printed, scanned into somebody's phone, or
    // shipped in an app build — so this domain has to keep answering them
    // even though the pages themselves live with the product.
    //
    // The :id forms are declared in serve.json only; Astro's static redirect
    // map has no way to carry a parameter through.
    '/post': 'https://app.usecardly.app/post',
    '/embed/post-editor': 'https://app.usecardly.app/embed/post-editor',
  },

  vite: {
    plugins: [tailwindcss()],
  },
});
