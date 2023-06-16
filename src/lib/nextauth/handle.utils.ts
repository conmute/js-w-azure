import { type Session } from "next-auth";
import { type JWT } from "next-auth/jwt";

import { decodeRecord } from "src/lib/encrypt"
import { SessionAccessConfig } from "src/types/access";

export const extendSession = ({ session, token }: { session: Session, token: {
    encodedAccessConfig?: string
} }): Promise<Session> => {
    // TODO: session exactly is not populated with accessConfig here!
    if (session && token.encodedAccessConfig) {
        try {
            const decoded = decodeRecord<SessionAccessConfig>(token.encodedAccessConfig)
            const accessConfig = { namespaces: decoded.namespaces }
            return Promise.resolve({
                ...session,
                accessConfig,
            })
        } catch(e) {
            console.error("Failed to populate access config to the session")
        }
    }
    return Promise.resolve(session)
}
