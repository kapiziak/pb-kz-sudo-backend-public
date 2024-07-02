import { SuperId } from "@prisma/client";
import TApiError from "../errors/api-errors";

export type TGetSuperIdResponse = TApiResponse<{
    superId: Pick<SuperId, "id" | "secret" | "validTo" | "userId">;
}>;

export type TCreateSuperIdResponse = TApiResponse<{
    superId: Pick<SuperId, "id" | "secret" | "validTo" | "userId">;
}>;

export type TRevokeSuperIdResponse = TApiResponse<{
    revokedId: number;
}>;

export type TUseSecretSuperIdResponse = TApiResponse<{
    challengeId: string;
    identityCardId: string | null;
    studentId: string | null;
    userId: number;
}>;

export const superIdErrors: Record<
    | "getDbError"
    | "getPayloadError"
    | "getNotFound"
    | "addDbError"
    | "addPayloadError"
    | "updatePayloadError"
    | "updateDbError"
    | "deletePayloadError"
    | "deleteDbError"
    | "validToParseError"
    | "useSecretPayloadError"
    | "useSecretNotFound",
    TApiError
> = {
    getNotFound: {
        code: "GET_SUPER_ID_NOT_FOUND",
        message: "SuperId assigned to your account not found",
    },
    getDbError: {
        code: "GET_SUPER_ID_DB_ERROR",
        message: "Error while fetching SuperId from database",
    },
    getPayloadError: {
        code: "GET_SUPER_ID_PAYLOAD_ERROR",
        message: "Error while parsing request's payload",
    },
    addDbError: {
        code: "ADD_SUPER_ID_DB_ERROR",
        message: "Error while adding new SuperId to database",
    },
    addPayloadError: {
        code: "ADD_SUPER_ID_PAYLOAD_ERROR",
        message: "Error while parsing request's payload",
    },
    updatePayloadError: {
        code: "UPDATE_SUPER_ID_PAYLOAD_ERROR",
        message: "Error while parsing request's payload",
    },
    updateDbError: {
        code: "UPDATE_SUPER_ID_DB_ERROR",
        message: "Error while updating SuperId in database",
    },
    deletePayloadError: {
        code: "DELETE_SUPER_ID_PAYLOAD_ERROR",
        message: "Error while parsing request's payload",
    },
    deleteDbError: {
        code: "DELETE_SUPER_ID_DB_ERROR",
        message: "Error while deleting SuperId from database",
    },
    validToParseError: {
        code: "VALID_TO_PARSE_ERROR",
        message: "Error while parsing validTo date",
    },
    useSecretNotFound: {
        code: "USE_SECRET_NOT_FOUND",
        message: "SuperId not found",
    },
    useSecretPayloadError: {
        code: "USE_SECRET_PAYLOAD_ERROR",
        message: "Error while parsing request's payload",
    },
};
