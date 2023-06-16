'use client'

import { useSession } from 'next-auth/react'

export const ClientSessionPrint = () => {

  const { data: session } = useSession()

  return (
    <>
        <pre>{JSON.stringify(session, null, 2)}</pre>
    </>
  )
}
