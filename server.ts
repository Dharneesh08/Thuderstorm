import express, { type Request, type Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = Number(process.env.PORT) || 3000;
const host = '0.0.0.0';

// Health check endpoint for Cloud Run and container liveness
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).send('OK');
});

const distPath = path.resolve(__dirname, 'dist');

if (fs.existsSync(distPath)) {
  // Serve built assets
  app.use(express.static(distPath));

  // SPA fallback
  app.get('*', (_req: Request, res: Response) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  // Fallback to project root if accessed before build
  app.use(express.static(__dirname));
  app.get('*', (_req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, 'index.html'));
  });
}

app.listen(port, host, () => {
  console.log(`Server listening on http://${host}:${port}`);
});
