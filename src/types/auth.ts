export interface SessionInfo {
    userId: number;
    roles: string[];
}

export type JWTUserPayload = {
    sub: string;
    roles: string[];
    exp?: number;
    nbf?: number;
    iat?: number;
    aud?: string;
    iss?: string;
};
  