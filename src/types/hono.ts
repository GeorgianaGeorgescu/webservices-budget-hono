import { Context } from 'hono';
import type { SessionInfo } from './auth';

export interface BudgetAppState {
  session: SessionInfo;
}

export interface HonoContext extends Context<HonoEnv> {
  session: SessionInfo;
}

export type HonoEnv<
  Res = unknown,
  Param = {},
  Req = unknown,
  Query = {},
  Variables = { session: SessionInfo },
  Session = SessionInfo,
> = {
  Variables: Variables;
  Session: Session;
  Request: {
    json: Req;
    param: Param;
    query: Query;
  };
  Response: Res;
};