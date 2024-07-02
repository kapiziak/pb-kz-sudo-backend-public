import BlobManager from ".";
import { TBlobData, TBlobFile } from "../../types/blob-manager/blob-type";

class MockedBlobManager extends BlobManager {
    read(path: string): Promise<TBlobData> {
        throw new Error("Method mocked!");
    }
    write(
        container: string,
        path: string,
        file: TBlobFile
    ): Promise<TBlobData> {
        throw new Error("Method mocked!");
    }
}

export default MockedBlobManager;
