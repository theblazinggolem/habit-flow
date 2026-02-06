import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'simple-json-server',
      configureServer(server) {
        // Handle /api/:type (tasks, goals, reminders, habits)
        server.middlewares.use('/api', (req, res, next) => {
          const urlParts = req.url.split('/'); // e.g., ['', 'tasks'] if url is /tasks (since prefix is /api)
          // The middleware is mounted at /api, so req.url is relative to it.
          // However, in Vite middlewares, it might behave differently or we might need to parse.
          // Let's use a regex or check the path properly.
          // Note: When using server.middlewares.use('/api', ...), req.url will start with / if called as /api/tasks (req.url = /tasks)

          // Simple router for /<type>
          const match = req.url.match(/^\/([a-z]+)$/);
          if (match) {
            const type = match[1];
            const allowedTypes = ['tasks', 'goals', 'reminders', 'habits'];

            if (!allowedTypes.includes(type)) {
              res.statusCode = 404;
              res.end(JSON.stringify({ error: 'Not found' }));
              return;
            }

            const dbPath = path.resolve(process.cwd(), 'data', `${type}.json`);

            if (req.method === 'GET') {
              try {
                if (fs.existsSync(dbPath)) {
                  res.setHeader('Content-Type', 'application/json');
                  res.end(fs.readFileSync(dbPath));
                } else {
                  res.end(JSON.stringify([])); // Return empty array for individual files
                }
              } catch (e) {
                console.error(e);
                res.statusCode = 500;
                res.end(JSON.stringify({ error: 'Failed to read data' }));
              }
            } else if (req.method === 'POST') {
              let body = '';
              req.on('data', chunk => {
                body += chunk.toString();
              });
              req.on('end', () => {
                try {
                  try {
                    JSON.parse(body);
                  } catch {
                    res.statusCode = 400;
                    res.end(JSON.stringify({ error: 'Invalid JSON' }));
                    return;
                  }
                  fs.writeFileSync(dbPath, body);
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ success: true }));
                } catch (e) {
                  console.error(e);
                  res.statusCode = 500;
                  res.end(JSON.stringify({ error: 'Failed to write data' }));
                }
              });
            } else {
              next();
            }
          } else {
            next();
          }
        });
      }
    }
  ],
})
