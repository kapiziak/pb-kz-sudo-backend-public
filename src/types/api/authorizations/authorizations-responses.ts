import { Authorization } from "@prisma/client";
import TApiError from "../errors/api-errors";

export type TGetAllAuthorizationsResponse = TApiResponse<{
    authorizations: Authorization[];
}>;

export type TGetAuthorizationResponse = TApiResponse<{
    authorization: Authorization;
}>;

export type TAddNewAuthorizationResponse = TApiResponse<{
    authorization: Authorization;
}>;

export type TUpdateAuthorizationResponse = TApiResponse<{
    authorization: Authorization;
}>;

export type TDeleteAuthorizationResponse = TApiResponse<{
    deletedId: number;
}>;

export const authorizationsErrors: Record<
    | "getDbError"
    | "getPayloadError"
    | "getNotFound"
    | "addDbError"
    | "addPayloadError"
    | "updatePayloadError"
    | "updateDbError"
    | "deletePayloadError"
    | "deleteDbError"
    | "parseExpireAtError",
    TApiError
> = {
    getNotFound: {
        code: "GET_AUTHORIZATIONS_NOT_FOUND",
        message: "Authorization with given id not found",
    },
    getDbError: {
        code: "GET_AUTHORIZATIONS_DB_ERROR",
        message: "Error while fetching AUTHORIZATIONS from database",
    },
    getPayloadError: {
        code: "GET_AUTHORIZATIONS_PAYLOAD_ERROR",
        message: "Error while parsing request's payload",
    },
    addPayloadError: {
        code: "ADD_AUTHORIZATIONS_PAYLOAD_ERROR",
        message: "Error while parsing request's payload",
    },
    addDbError: {
        code: "ADD_AUTHORIZATIONS_DB_ERROR",
        message: "Error while adding new Authorization to database",
    },
    updatePayloadError: {
        code: "UPDATE_AUTHORIZATIONS_PAYLOAD_ERROR",
        message: "Error while parsing request's payload",
    },
    updateDbError: {
        code: "UPDATE_AUTHORIZATIONS_DB_ERROR",
        message: "Error while updating Authorization in database",
    },
    deletePayloadError: {
        code: "DELETE_AUTHORIZATIONS_PAYLOAD_ERROR",
        message: "Error while parsing request's payload",
    },
    deleteDbError: {
        code: "DELETE_AUTHORIZATIONS_DB_ERROR",
        message: "Error while deleting Authorization from database",
    },
    parseExpireAtError: {
        code: "PARSE_EXPIRE_AT_ERROR",
        message: "Wrong expireAt date format",
    },
};
