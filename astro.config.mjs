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

  redirects: {
    // Account deletion stays with the product: it needs a signed-in Supabase
    // session to actually delete anything. The public URL has been handed to
    // Apple, so it has to keep resolving from this domain — as a redirect
    // rather than a copy, because two pages describing account deletion is
    // how one of them goes stale.
    '/delete-account': 'https://app.usecardly.app/delete-account',

    // Addresses that were live on this domain before the split. Left as
    // redirects so shared links and anything already indexed still land.
    '/app': 'https://app.usecardly.app/app',
    '/signin': 'https://app.usecardly.app/signin',
    '/dashboard': 'https://app.usecardly.app/app',
    '/settings': 'https://app.usecardly.app/app/settings',
  },

  vite: {
    plugins: [tailwindcss()],
  },
});
