import { redirect } from "next/navigation"

import { getServerSession } from "src/lib/nextauth"

import { BlobForm, BlobItems } from "./blob.client"

export default async function BlobExample() {

    const session = await getServerSession()

    if (!session) {
        redirect('/api/auth/signin')
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            Some protecter route

            AZURE_BLOB_STORAGE_URL: {process.env.AZURE_BLOB_STORAGE_URL}

            <br />

            <img
                src="https://delveblobs.blob.core.windows.net/images/Bitmap.png"
            />

            <BlobForm />

        </main>
    )
}
