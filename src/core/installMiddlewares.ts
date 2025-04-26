import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { prettyJSON } from 'hono/pretty-json';
import { secureHeaders } from 'hono/secure-headers';
import { getLogger } from './logging';
import config from 'config';
import { HTTPException } from 'hono/http-exception';

const NODE_ENV = process.env.NODE_ENV;
const CORS_ORIGINS = config.get<string>('cors.origins');
const CORS_MAX_AGE = config.get<number>('cors.maxAge');
const isDevelopment = NODE_ENV === 'development';

export default function installMiddlewares(app: Hono) {

  app.onError((err, c) => {
    if (err instanceof HTTPException) {
      return c.json({
        status: err.status,
        message: err.message,
      }, err.status);
    } else {
      return c.json(
        {
          message: 'Internal Server Error',
          error: err.message || 'An unknown error occurred',
        },
        500
      );
    }
  });

  app.use(
    '*',
    cors({
      origin: (origin) => {
        if (origin && CORS_ORIGINS.includes(origin)) {
          return origin;
        }
        return CORS_ORIGINS[0] || '';
      },
      allowHeaders: ['Accept', 'Content-Type', 'Authorization'],
      maxAge: CORS_MAX_AGE,
    })
  );

  app.use('*', async (c, next) => {
    getLogger().info(`⏩ ${c.req.method} ${c.req.url}`);
    await next();
    const status = c.res.status;
    const emoji =
      status >= 500
        ? '💀'
        : status >= 400
        ? '❌'
        : status >= 300
        ? '🔀'
        : status >= 200
        ? '✅'
        : '🔄';
    getLogger().info(`${emoji} ${c.req.method} ${status} ${c.req.url}`);
  });

  if (!isDevelopment) {
    app.use('*', secureHeaders({
      contentSecurityPolicy: {},
    }));
  } else {
    app.use('*', secureHeaders());
  }

  app.use('*', prettyJSON());

  app.notFound((c) =>
    c.json(
      {
        code: 'NOT_FOUND',
        message: `Unknown resource: ${c.req.url}`,
      },
      404
    )
  );
}