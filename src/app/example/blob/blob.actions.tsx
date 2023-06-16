'use server'

import {
    BlobServiceClient,
} from "@azure/storage-blob";

import { generateBlobSASToken, generateAccountSASToken } from "./utils.server"

import { File } from "./blob.type"

export const generateBlobSasTokenServerAction = generateBlobSASToken

export async function listBlobItems({ containerName }: {
    containerName: string
}) {
    const accountSasToken = await generateAccountSASToken();
    const blobServiceUri = process.env.AZURE_BLOB_STORAGE_URL
    const blobServiceClient = new BlobServiceClient(
        `${blobServiceUri}?${accountSasToken}`,
    );
    const containerClient = blobServiceClient.getContainerClient(containerName)
    const items: File[] = []
    for await (const blobItem of containerClient.listBlobsFlat()) {
        items.push({
            name: blobItem.name,
            lastModified: blobItem.properties.lastModified as Date,
            size: blobItem.properties.contentLength as number,
            type: blobItem.properties.contentType as string,
            url: containerClient.getBlockBlobClient(blobItem.name).url,
        })
    }
    return {
        items,
    }
}
