import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, type Plugin } from 'vite';
import app from './src/worker/index.ts';

function cloudflareWorkerDevPlugin(): Plugin {
  return {
    name: 'cloudflare-worker-dev',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api')) {
          return next();
        }

        try {
          const protocol = 'http';
          const host = req.headers.host || 'localhost:3000';
          const fullUrl = new URL(req.url, `${protocol}://${host}`);

          const headers = new Headers();
          for (const [key, value] of Object.entries(req.headers)) {
            if (Array.isArray(value)) {
              value.forEach((v) => headers.append(key, v));
            } else if (value) {
              headers.set(key, value);
            }
          }

          let body: any = undefined;
          if (req.method !== 'GET' && req.method !== 'HEAD') {
            const chunks: any[] = [];
            for await (const chunk of req) {
              chunks.push(chunk);
            }
            body = Buffer.concat(chunks);
          }

          const webReq = new Request(fullUrl.toString(), {
            method: req.method,
            headers,
            body,
          });

          const mockEnv = {
            ENVIRONMENT: 'development',
          };

          const response = await app.fetch(webReq, mockEnv);

          res.statusCode = response.status;
          response.headers.forEach((val, key) => {
            res.setHeader(key, val);
          });

          const buffer = await response.arrayBuffer();
          res.end(Buffer.from(buffer));
        } catch (err: any) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: err.message || 'Worker dev server error' }));
        }
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), cloudflareWorkerDevPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, '.'),
        '@client': path.resolve(import.meta.dirname, './src/client'),
        '@worker': path.resolve(import.meta.dirname, './src/worker'),
        '@shared': path.resolve(import.meta.dirname, './src/shared'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
