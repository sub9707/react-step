import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path';
import mdx from '@mdx-js/rollup';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

// https://vite.dev/config/
export default defineConfig({
  plugins: [    {
      ...mdx({
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeHighlight],
        providerImportSource: '@mdx-js/react'
      }),
      enforce: 'pre'
    },
    react(), tailwindcss()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@components': resolve(__dirname, './src/components'),
      '@assets': resolve(__dirname, './src/assets'),
      '@contents': resolve(__dirname, './src/assets/contents')
    }
  },
  server:{
    host:true,
    port: 5173,
    allowedHosts: ['.ngrok-free.app'],
  }
})
