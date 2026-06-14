import express, {
  type Application,
  type Request,
  type Response,
} from 'express';
import dotenv from 'dotenv';
dotenv.config();

import Router from './router/server.route.js';
import { migrate } from './config/migrate.js';

const app: Application = express();
const port: number = Number(process.env.PORT) || 5000;

app.use(express.json());

app.use('/api', Router);

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'DevPulse is Running successfully',
  });
});

// Run database migrations then start the server
migrate()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is Running on ${port}`);
    });
  })
  .catch((err) => {
    console.error('Migration failed:', err);
    process.exit(1);
  });
