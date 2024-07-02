import {
    BlobServiceClient,
    StorageSharedKeyCredential,
} from "@azure/storage-blob";

import dotenv from "dotenv";

dotenv.config();

function getBlobServiceClient() {
    const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME,
        accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;

    if (!accountKey || !accountName) {
        throw new Error(
            "[Azure Storage Client] AZURE_STORAGE_ACCOUNT_NAME and AZURE_STORAGE_ACCOUNT_KEY must be set"
        );
    }

    const storageAccountBaseUrl = `https://${accountName}.blob.core.windows.net`,
        sharedKeyCredential = new StorageSharedKeyCredential(
            accountName,
            accountKey
        );

    const blobServiceClient = new BlobServiceClient(
        storageAccountBaseUrl,
        sharedKeyCredential
    );

    return blobServiceClient;
}

export default getBlobServiceClient;
