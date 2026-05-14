import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'
import sitemap from '@astrojs/sitemap'
import node from '@astrojs/node'

// Note: redirects are managed by Kritano CMS (admin at /admin/redirects) and emitted
// to /etc/nginx/snippets/kritano-redirects.conf on every admin save. nginx serves true
// 301s from that snippet — no Astro-side redirect logic needed.

export default defineConfig({
  site: 'https://chrisgarlick.com',
  output: 'static',
  adapter: node({ mode: 'standalone' }),
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
