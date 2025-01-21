import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig(() => {
    return {
        plugins: [vue()],
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url))
            }
        },
        server: {
            port: 5173,
            proxy: {
              "/server": {
                target: "http://localhost:8768/",
                ws: true,              // Support WebSockets
                secure: false,         // Ignore SSL for dev
                changeOrigin: true,    // Modify the Origin header
                rewrite: (p) => p.replace(/^\/server/, ""), // Remove `/server` prefix
              },
            },
        },
    };
});
