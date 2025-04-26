import type { SessionInfo } from './auth';

export interface BudgetAppState {
  session: SessionInfo;
}

// export type HonoEnv<
//   Req = unknown,
//   Res = unknown,
//   Param = {},
//   Query = {},
//   Variables = { session: SessionInfo },
//   Session = SessionInfo,
// > = {
//   Variables: Variables;
//   Session: Session;
//   Request: {
//     json: Req;
//     param: Param;
//     query: Query;
//   };
//   Response: Res;
// };