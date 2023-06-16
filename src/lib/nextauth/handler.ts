import NextAuth, { Session } from "next-auth"
import AzureADB2CProvider from "next-auth/providers/azure-ad-b2c";

import { type SessionAccessConfig } from "src/types/access"
import { encodeRecord, decodeRecord } from "src/lib/encrypt"

import { exampleAccessData } from "./accessExample.data"
import { extendSession } from "./handle.utils"

const encodedAccessToken = encodeRecord(exampleAccessData)

export const nextAuthHandler = NextAuth({
    // pages: {
    //   signIn: '/auth/signin',
    //   signOut: '/auth/signout',
    //   error: '/auth/error',
    //   verifyRequest: '/auth/verify-request',
    //   newUser: '/auth/new-user'
    // },
    session: {
      strategy: "jwt",
    },
    callbacks: {
      async jwt({ token, account, session }) {
        if (account) {
          console.log({
            token,
            account,
            session,
          })
          token.encodedAccessConfig = encodedAccessToken;
        }
        return token
      },
      session: extendSession,
    },
    providers: [
        AzureADB2CProvider({
            tenantId: process.env.AZURE_AD_B2C_TENANT_NAME,
            clientId: process.env.AZURE_AD_B2C_CLIENT_ID,
            clientSecret: process.env.AZURE_AD_B2C_CLIENT_SECRET,
            primaryUserFlow: process.env.AZURE_AD_B2C_PRIMARY_USER_FLOW,
            authorization: { params: { scope: `offline_access openid` } }, // offline_access
            checks: ["pkce"],
            client: {
              token_endpoint_auth_method: 'none'
            },
        }),
    ],
})
