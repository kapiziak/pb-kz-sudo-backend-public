import { Entry } from "@prisma/client";
import TApiError from "../errors/api-errors";

export type TGetAllEntriesResponse = TApiResponse<{
    entries: Entry[];
}>;

export type TGetEntryResponse = TApiResponse<{
    entry: Entry;
}>;

export type TAddNewEntryResponse = TApiResponse<{
    entry: Entry;
}>;

export type TReleaseEntryResponse = TApiResponse<{
    entry: Entry;
}>;

export const entryErrors: Record<
    | "addDbError"
    | "payloadError"
    | "releaseDbError"
    | "facilityOccupiedError"
    | "getDbError"
    | "notFound",
    TApiError
> = {
    addDbError: {
        code: "ADD_ENTRY_DB_ERROR",
        message: "Error while adding new entry to database",
    },
    payloadError: {
        code: "ADD_ENTRY_PAYLOAD_ERROR",
        message: "Error while parsing request's payload",
    },
    releaseDbError: {
        code: "RELEASE_ENTRY_DB_ERROR",
        message: "Error while releasing entry in database",
    },
    facilityOccupiedError: {
        code: "FACILITY_OCCUPIED_ERROR",
        message: "Facility is already occupied",
    },
    getDbError: {
        code: "GET_ENTRY_DB_ERROR",
        message: "Error while getting entry from database",
    },
    notFound: {
        code: "ENTRY_NOT_FOUND",
        message: "Entry not found",
    },
};
