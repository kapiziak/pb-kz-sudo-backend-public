import { HttpRequestBody } from "@azure/storage-blob";

export type TBlobFile = {
    body: HttpRequestBody;
    size: number;
    mimetype: string;
    encoding?: string;
};

export type TBlobData = {
    url: string;
};
