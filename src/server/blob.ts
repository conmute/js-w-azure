// import { BlobServiceClient, StorageSharedKeyCredential, generateBlobSASQueryParameters } from "@azure/storage-blob"

// export const sharedKeyCredential = new StorageSharedKeyCredential(
//     process.env.AZURE_BLOB_STORAGE_ACCOUNT_NAME,
//     process.env.AZURE_BLOB_STORAGE_KEY
// )

// export const getContainerSAS = () => {
//     console.log({
//         sharedKeyCredential
//     })
//     return generateBlobSASQueryParameters(
//         {
//             containerName: 'images',
//             identifier: 'very-random-id'
            
//         },
//         sharedKeyCredential // StorageSharedKeyCredential - `new StorageSharedKeyCredential(account, accountKey)`
//     ).toString();
// }

// const blobClient = new BlobServiceClient(containerSAS)

export {}
