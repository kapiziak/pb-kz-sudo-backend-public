import { Facility, FacilityOccupancy } from "@prisma/client";
import TApiError from "../errors/api-errors";

export type TGetAllFacilitiesResponse = TApiResponse<{
    facilities: Facility[];
}>;

export type TGetFacilityResponse = TApiResponse<{
    facility: Facility;
}>;

export type TAddNewFacilityResponse = TApiResponse<{
    facility: Facility;
}>;

export type TUpdateFacilityResponse = TApiResponse<{
    facility: Facility;
}>;

export type TDeleteFacilityResponse = TApiResponse<{
    deletedId: number;
}>;

export type TCheckFacilityOccupiedResponse = TApiResponse<{
    isOccupied: boolean;
    occupancies: FacilityOccupancy[];
}>;

export type TReleaseFacilityOccupancyResponse = TApiResponse<{
    isOccupied: false;
}>;

export const facilitiesErrors: Record<
    | "getDbError"
    | "getPayloadError"
    | "getNotFound"
    | "addDbError"
    | "updatePayloadError"
    | "updateDbError"
    | "deletePayloadError"
    | "deleteDbError"
    | "occupiedDbError"
    | "releaseDbError",
    TApiError
> = {
    getNotFound: {
        code: "GET_FACILITIES_NOT_FOUND",
        message: "Facility with given id not found",
    },
    getDbError: {
        code: "GET_FACILITIES_DB_ERROR",
        message: "Error while fetching facilities from database",
    },
    getPayloadError: {
        code: "GET_FACILITIES_PAYLOAD_ERROR",
        message: "Error while parsing request's payload",
    },
    addDbError: {
        code: "ADD_FACILITIES_DB_ERROR",
        message: "Error while adding new facility to database",
    },
    updatePayloadError: {
        code: "UPDATE_FACILITIES_PAYLOAD_ERROR",
        message: "Error while parsing request's payload",
    },
    updateDbError: {
        code: "UPDATE_FACILITIES_DB_ERROR",
        message: "Error while updating facility in database",
    },
    deletePayloadError: {
        code: "DELETE_FACILITIES_PAYLOAD_ERROR",
        message: "Error while parsing request's payload",
    },
    deleteDbError: {
        code: "DELETE_FACILITIES_DB_ERROR",
        message: "Error while deleting facility from database",
    },
    occupiedDbError: {
        code: "OCCUPIED_FACILITIES_DB_ERROR",
        message: "Error while checking if facility is occupied",
    },
    releaseDbError: {
        code: "RELEASE_FACILITIES_DB_ERROR",
        message: "Error while releasing facility",
    },
};
