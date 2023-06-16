'use client';

import React from "react";
import { useSession } from 'next-auth/react'

import { Button } from "src/components/button"

import {
    BlobServiceClient,
} from "@azure/storage-blob";

import {
    generateBlobSasTokenServerAction,
    listBlobItems,
} from "./blob.actions"

import {
    File,
} from "./blob.type"

const WORKING_CONTAINER_NAME = "test-container" // "images"

const listThings = async () => {
    return new Promise<Awaited<ReturnType<typeof listBlobItems>>>((resolve) => {
        setTimeout(async () => {
            resolve(await listBlobItems({
                containerName: WORKING_CONTAINER_NAME
            }))
        }, 200);
    })
}

export const BlobItems = ({ list, onDelete }: {
    list: File[],
    onDelete: (data: File) => void
}) => {
    return (
        <>
            <h2>
                File list:
            </h2>

            <div>
                <ul role="list" className="divide-y divide-gray-100 dark:divide-gray-800">
                    {list.map((file, index) => (
                        <BlobItem key={index} data={file} onDelete={onDelete} />
                    ))}
                </ul>
            </div>
        </>
    )
}

export const BlobItem = ({ data, progress, onDelete }: {
    data: File
    progress?: number
    onDelete?: (data: File) => void
}) => {
    return (
        <li className="flex items-center justify-between gap-x-6 py-5">
            <div className="flex gap-x-4">
                <span className="flex items-center justify-around align-middle h-12 w-12 flex-none rounded-full bg-gray-50 dark:bg-gray-950">
                    <span className="fa fa-image text-[32px]" />
                </span>
                <div className="min-w-0 flex-auto">
                    <p className="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-50">{data.name}</p>
                    <p className="mt-1 truncate text-xs leading-5 text-gray-500 dark:text-gray-300">
                        {progress && <>{Math.round(progress)}% | </>}
                        {Math.round(data.size / 1024 * 100) / 100} KB |{' '}
                        {(new Date(data.lastModified)).toLocaleString()}
                    </p>
                </div>
            </div>
            {data.url && (
                <span>
                    <span
                        onClick={() => onDelete && onDelete(data)}
                        className="cursor-pointer rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                        Remove
                    </span>
                    <a
                        href={data.url}
                        target="_blank"
                        className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >View</a>
                </span>
            )}
        </li>
    )
}

export const BlobForm = ({}: {}) => {

    const [fileList, setFileList] = React.useState<File[]>([])
    const [uploadingFilesList, setUploadingFileList] = React.useState<(File & { progress: number } )[]>([])
    const [sasBlobToken, setSasBlobToken] = React.useState<string>()
    const { data: session } = useSession()

    React.useEffect(() => {
        handleListLoad()
    }, []);

    React.useEffect(() => {
        if (!session) return;
        // generateAccountSasTokenServerAction()
        //     .then(setSasAccountToken)
        //     .catch((error) => {
        //         console.error('Error generating SAS token:', error);
        //     });
        generateBlobSasTokenServerAction({
            containerName: WORKING_CONTAINER_NAME,
        })
            .then(setSasBlobToken)
            .catch((error) => {
                console.error('Error generating SAS token:', error);
            });
    }, [session?.expires])


    const handleListLoad = () => {
        listThings().then((response) => {
            setFileList(response.items)
        })
    }

    const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.files, session)
        if (!e.target.files || !session) return;
        const fileList = Array.from(e.target.files).map(({ name, lastModified, type, size  }) => ({
            name, lastModified: new Date(lastModified), type, size, progress: 0,
        }));
        setUploadingFileList(fileList);

        const processFiles = Array.from(e.target.files)

        const blobServiceUri = "https://delveblobs.blob.core.windows.net/"
        const blobServiceClient = new BlobServiceClient(
            `${blobServiceUri}?${sasBlobToken}`,
        );
        const containerClient = blobServiceClient.getContainerClient(WORKING_CONTAINER_NAME)
        processFiles.forEach(async (file) => {
            const blobClient = await containerClient.getBlockBlobClient(file.name);
            const uploadBlobresponse = await blobClient.uploadData(file, {
                onProgress: function({ loadedBytes }) {
                    setUploadingFileList((fileList) => {
                        return fileList.map((item) => {
                            if (file.name === item.name) {
                                return {
                                    ...item,
                                    progress: loadedBytes / file.size * 100,
                                }
                            }
                            return item
                        })
                    });
                },
                blobHTTPHeaders: {
                    blobContentType: file.type,
                }
            })
            setUploadingFileList((fileList) => fileList.filter((item) => file.name !== item.name))
            handleListLoad()
        })

    }

    const handleBlobDelete = async ({ name }: { name: string }) => {
        const blobServiceUri = "https://delveblobs.blob.core.windows.net/"
        const blobServiceClient = new BlobServiceClient(
            `${blobServiceUri}?${sasBlobToken}`,
        );
        const containerClient = blobServiceClient.getContainerClient(WORKING_CONTAINER_NAME)
        const blobClient = await containerClient.getBlockBlobClient(name);
        const deletionResult = await blobClient.deleteIfExists()
        handleListLoad()
    }
    
    return (
        <form>

            <BlobItems list={fileList} onDelete={(file: File) => {
                handleBlobDelete({
                    name: file.name
                })
            }} />

            <ul role="list" className="divide-y divide-gray-100 dark:divide-gray-800">
                {uploadingFilesList.map((file, index) => (
                    <BlobItem
                        key={index}
                        data={file}
                        progress={file.progress}
                    />
                ))}
            </ul>

            <div className="max-w-2xl mx-auto">

                <div className="flex items-center justify-center w-full">
                    <label
                        htmlFor="dropzone-file"
                        className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                    >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg
                                className="w-10 h-10 mb-3 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            ><path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            ></path></svg>
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                        </div>
                        <input
                            id="dropzone-file"
                            name="files"
                            type="file"
                            multiple
                            className="hidden"
                            onChange={handleFileInputChange}
                        />
                    </label>
                </div> 

            </div>

            <Button type="submit">Submit</Button>

        </form>
    )
}
