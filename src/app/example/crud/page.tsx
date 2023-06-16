import { redirect } from 'next/navigation';

import { getServerSession } from "src/lib/nextauth"

import { HandleItems } from "./form.client"

export default async function CrudExample() {

    const session = await getServerSession()

    if (!session) {
        redirect('/api/auth/signin')
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <HandleItems />
        </main>
    )
}
