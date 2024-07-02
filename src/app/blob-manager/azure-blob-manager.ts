import { v4 as uuidv4 } from "uuid";
import BlobManager from ".";
import { TBlobFile } from "../../types/blob-manager/blob-type";
import getBlobServiceClient from "../azure-storage/blobServiceClient";

class AzureBlobManager extends BlobManager {
    constructor() {
        super();
    }

    async write(container: string, path: string, file: TBlobFile) {
        const containerClient =
            getBlobServiceClient().getContainerClient(container);

        const filePath = `${path}/${uuidv4()}`;
        const blockBlobClient = containerClient.getBlockBlobClient(filePath);

        const result = await blockBlobClient.upload(file.body, file.size, {
            blobHTTPHeaders: {
                blobContentType: file.mimetype,
                blobContentEncoding: file.encoding,
            },
        });

        return {
            url: this.contructUrl(container, filePath),
        };
    }

    // // Implement the read function if required
    // async read(container: string, path: string) {
    //     const containerClient = blobServiceClient.getContainerClient(container);
    //     const blockBlobClient = containerClient.getBlockBlobClient(path);

    //     // Example implementation to download the content as a buffer
    //     const downloadBlockBlobResponse = await blockBlobClient.download(0);
    //     return downloadBlockBlobResponse.readableStreamBody;
    // }

    protected contructUrl(container: string, path: string) {
        return `${getBlobServiceClient().url}${container}/${path}`;
    }
}

export default AzureBlobManager;
