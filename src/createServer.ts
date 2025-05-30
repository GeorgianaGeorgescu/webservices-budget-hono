import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import config from 'config';
import installMiddlewares from './core/installMiddlewares';
import { initializeData, shutdownData } from './data';
import installRest from './rest';
import { getLogger } from './core/logging';
import { installSwaggerRoutes } from './core/swagger';

const PORT = config.get<number>('port');

export interface Server {
  getApp(): Hono;
  start(): Promise<void>;
  stop(): Promise<void>;
}

export default async function createServer(): Promise<Server> {
  const app = new Hono();

  installMiddlewares(app);  
  await initializeData();   
  installRest(app);
  installSwaggerRoutes(app);      

  return {
    getApp() {
      return app;
    },

    async start() {
      return new Promise<void>((resolve, reject) => {
        try {
          serve({
            fetch: app.fetch,
            port: PORT,
          }, (info) => {
            getLogger().info(`🚀 Server listening on http://localhost:${info.port}`);
            resolve(); 
          });
        } catch (error) {
          reject(error);
        }
      });
    },

    async stop() {
      await shutdownData();
      getLogger().info('Goodbye! 👋'); 
    },
  };
}
