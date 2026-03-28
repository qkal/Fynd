import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte({ hot: !process.env.VITEST })],
  test: {
    environmentMatchGlobs: [
      ['tests/svelte/**', 'jsdom'],
    ],
    include: ['tests/**/*.test.ts', 'tests/**/*.test.svelte.ts'],
  },
});
