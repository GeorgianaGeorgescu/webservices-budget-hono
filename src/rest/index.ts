import type { Hono } from 'hono';
import { Hono as HonoApp } from 'hono';
import installSessionRoutes from './session';
import installUserRoutes from './user';

export default (app: Hono) => {
  const apiRouter = new HonoApp();

  installUserRoutes(apiRouter);
  installSessionRoutes(apiRouter);

  app.route('/api', apiRouter);
};
