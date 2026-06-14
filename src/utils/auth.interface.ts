import type {JwtPayload} from '.';

declare global {
  namespace Express {
    interface Request {
      user: JwtPayload;
    }
  }
}

export {}