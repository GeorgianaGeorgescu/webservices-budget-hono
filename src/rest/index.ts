import type { Hono } from 'hono';
import { Hono as HonoApp } from 'hono';
import installSessionRoutes from './session';
import installUserRoutes from './user';
import installTransactionRoutes from './transaction';
import installPlacesRoutes from './place';
import installHealthRoutes from './health'

export default (app: Hono) => {
  const apiRouter = new HonoApp();

  installUserRoutes(apiRouter);
  installSessionRoutes(apiRouter);
  installTransactionRoutes(apiRouter);
  installPlacesRoutes(apiRouter);
  installHealthRoutes(apiRouter);
  
  app.route('/api', apiRouter);
};
