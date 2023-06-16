import { NextRequest, NextResponse } from 'next/server';

import { InteractiveBrowserCredential } from "@azure/identity";
import { BlobServiceClient } from "@azure/storage-blob";
import * as fs from "fs"
import type { Readable } from 'stream';

// const credential = new InteractiveBrowserCredential({
//     clientId: process.env.AZURE_AD_B2C_CLIENT_ID,
//     tenantId: process.env.AZURE_AD_B2C_TENANT_NAME,
// });

// const blobService = new BlobServiceClient(process.env.AZURE_BLOB_STORAGE_URL, credential);

// const containerClient = blobService.getContainerClient("images")

// // const blockBlobClient = containerClient.getBlockBlobClient("image-example")

// const bufferSize = (1 * 1024 * 1024) / 2
// const blobMaxConcurency = 5

// const handler = async (req: NextRequest) => {
//     const formData = await req.formData();

//     // Remember to enforce type here and after use some lib like zod.js to check it
//     const files = formData.getAll('files') as File[];

//     files.forEach(async (file) => {
//         console.log({ file }, file.name, file.type, file.size, {
//             stream: file.stream,
//             arrayBuffer: file.arrayBuffer,
//             arrayBufferLength: file.arrayBuffer.length,
//         })
//         const blockBlobClient = containerClient.getBlockBlobClient(file.name)

//         // const readable = fs.createReadStream()

//         // file.

//         await blockBlobClient.uploadStream(file as any, bufferSize, blobMaxConcurency, {
//             blobHTTPHeaders: { blobContentType: file.type },
//             onProgress: (ev) => {
//                 console.log("ev", ev);
//             }
//         })
//     })

//     // containerClient.getBlobClient('')

//     // files

//     // block

    
//     // const fileToStorage = files[0];

//     // blockBlobClient.upload(fileToStorage.stream, content.length);

//     // containerClient.uploadBlockBlob("image", fileToStorage.stream, undefined, {
//     //     blobHTTPHeaders: { blobContentType: fileToStorage. },
//     // })

//     console.log({
//         // fileToStorage,
//         files,
//     })
//     // 

//     return NextResponse.json({ message: 'Files Created' });
// }

// export { handler as POST }
