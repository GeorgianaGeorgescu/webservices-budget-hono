
import { Context, Hono} from 'hono';
import * as healthService from '../service/healthService';

export const ping = async (c: Context): Promise<Response> => {
  const response= healthService.ping();
  return c.json(response, 200);
};

export default function installHealthRoutes(parent: Hono) {
  parent.get('/health/ping', ping);
}