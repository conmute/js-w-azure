import { type DefaultSession } from 'next-auth'

import { type NamespaceAccess } from './access'

declare module 'next-auth' {
    interface Session {
        user: {
            email: string
        }
        accessConfig: {
            namespaces: NamespaceAccess[]
        }
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        encodedAccessConfig: string
        namespaces: NamespaceAccess[]
    }
}
