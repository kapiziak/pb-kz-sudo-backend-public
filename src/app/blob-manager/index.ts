import { TBlobData, TBlobFile } from "../../types/blob-manager/blob-type";

abstract class BlobManager {
    constructor() {}
    async write(
        container: string,
        path: string,
        file: TBlobFile
    ): Promise<TBlobData> {
        throw new Error("Method not implemented.");
    }
    async read(path: string): Promise<TBlobData> {
        throw new Error("Method not implemented.");
    }
}

export default BlobManager;
