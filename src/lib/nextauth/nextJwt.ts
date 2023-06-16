import { JWT } from 'next-auth/jwt'
import { cookies } from 'next/headers'

import { decodeJwt } from "src/lib/jwt"

export const getJWTInfo = async (jwtStringInput?: string) => {
    const jwtString = jwtStringInput || cookies().get("next-auth.session-token")?.value
    if (!jwtString) return null
    return await decodeJwt(jwtString)
}

export const jwtNormalize = (jwt: Awaited<ReturnType<typeof decodeJwt>>) => {
    return {
        email: jwt.tokenDecoded?.email,
        name: jwt.tokenDecoded?.name,
        accessConfig: jwt.tokenAccessDecoded,
    }
}