import { redirect } from "next/navigation"

import { getServerSession } from "src/lib/nextauth"

export default async function CrudExample() {

    const session = await getServerSession()

    if (!session) {
        redirect('/api/auth/signin')
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            Some protecter route
        </main>
    )
}
