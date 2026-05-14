import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'
import sitemap from '@astrojs/sitemap'
import node from '@astrojs/node'

// ── Build-time redirect injection from the Kritano CMS ────────────────────
// The CMS admin at /admin/redirects manages redirect entries. At build time
// we fetch the full list and feed them into Astro's `redirects` config so
// they're emitted as static redirect files (or runtime redirects under SSR).
//
// Soft fallback: if the CMS is unreachable during build, the build continues
// with no CMS-managed redirects. Server-level redirects in deploy/setup-nginx.sh
// remain authoritative for wildcard rewrites and SEO-critical 301s.

const CMS_API_URL = process.env.CMS_API_URL || 'http://localhost:3005/api'

async function loadRedirects() {
  try {
    const res = await fetch(`${CMS_API_URL}/redirects/all`)
    if (!res.ok) return {}
    const { data } = await res.json()
    return Object.fromEntries(
      (data || []).map((r) => [
        r.fromPath,
        { status: Number(r.type) || 301, destination: r.toPath },
      ]),
    )
  } catch (err) {
    console.warn(`[astro.config] CMS redirects fetch failed: ${err.message}`)
    return {}
  }
}

export default defineConfig({
  site: 'https://chrisgarlick.com',
  output: 'static',
  adapter: node({ mode: 'standalone' }),
  redirects: await loadRedirects(),
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    sitemap({
      filter: (page) =>
        !page.includes('/admin') && !page.includes('/api/') && !page.endsWith('/thanks'),
    }),
  ],
  trailingSlash: 'never',
})
