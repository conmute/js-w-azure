import { NamespaceAccess } from "src/types/access"

export const exampleAccessData: {
    namespaces: NamespaceAccess[]
  } = {
    namespaces: [
      {
        name: 'example',
        level: 'owner',
      },
      {
        name: 'readonlyNamespace',
        level: 'participant',
        wildcard: ['*'],
        read: true,
        write: false,
      },
      {
        name: 'memberNamespace',
        level: 'participant',
        wildcard: [
          'service/*.srings',
          'service/*.html',
          'case/*.srings',
          'case/*.html',
        ],
        read: true,
        write: true,
      },
    ],
  }