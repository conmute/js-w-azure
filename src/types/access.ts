export type NamespaceAccess = {
    name: string
    level: 'owner' | 'participant'
    wildcard?: string[]
    read?: boolean
    write?: boolean
}

export type SessionAccessConfig = {
    namespaces: NamespaceAccess[]
}
