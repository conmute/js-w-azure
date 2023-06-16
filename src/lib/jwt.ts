import { JWT, decode } from "next-auth/jwt"

import { decodeRecord } from "src/lib/encrypt"
import { SessionAccessConfig } from "src/types/access"

export const decodeJwt = async (jwtString: string, full = true): Promise<{
    tokenDecoded: JWT | null,
    tokenAccessDecoded?: SessionAccessConfig | null
}> => {
    const tokenDecoded = await decode({
        secret: process.env.NEXTAUTH_SECRET,
        token: jwtString
    })
    if (!full) {
        return {
            tokenDecoded,
        }
    }
    const tokenAccessDecoded = tokenDecoded && decodeRecord<SessionAccessConfig>(tokenDecoded.encodedAccessConfig)
    return {
        tokenDecoded,
        tokenAccessDecoded,
    }
}
