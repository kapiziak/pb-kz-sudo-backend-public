import AzureBlobManager from "./azure-blob-manager";
import MockedBlobManager from "./mocked-blob-manager";

function getBlobManager() {
    const blobManagerSource = (process.env.BLOB_MANAGER_SOURCE ||
        "azure") as "azure";

    switch (blobManagerSource) {
        case "azure":
            return new AzureBlobManager();
        default:
            if (
                process.env.NODE_ENV === "development" ||
                process.env.node_env === "production"
            ) {
                throw new Error("Invalid blob manager source");
            } else {
                return new MockedBlobManager();
            }
    }
}

export default getBlobManager;
