import { type Session, getServerSession as originalGetServerSession } from 'next-auth';

import { nextAuthHandler } from "./handler"
import { extendSession } from "./handle.utils"
import { getJWTInfo } from "./nextJwt"

// TODO: Update when getServerSession will be improved https://github.com/nextauthjs/next-auth/issues/7533
// uses workaround
// @see: https://github.com/nextauthjs/next-auth/issues/7486#issuecomment-1543747325
export const getServerSession = async () => {
  const [session, jwtInfo] = await Promise.all([
    originalGetServerSession(nextAuthHandler) as Promise<Session>,
    getJWTInfo(),
  ])
  return extendSession({ session, token: {
    encodedAccessConfig: jwtInfo?.tokenDecoded?.encodedAccessConfig,
  } });
};
