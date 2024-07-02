import { Profile } from "@prisma/client";
import TApiError from "../errors/api-errors";

export type TGetProfileResponse = TApiResponse<{
    profile: Profile | null;
}>;

export type TUpdateProfileResponse = TApiResponse<{
    profile: Profile;
}>;

export type TCreateProfileResponse = TApiResponse<{
    profile: Profile;
}>;

export type TDeleteProfileResponse = TApiResponse<{
    deletedId: number;
}>;

export type TUploadAvatarResponse = TApiResponse<{
    profile: Profile;
}>;

export const profileErrors: Record<
    | "createDbError"
    | "payloadError"
    | "updateDbError"
    | "deleteDbError"
    | "avatarUploadError",
    TApiError
> = {
    createDbError: {
        code: "CREATE_PROFILE_DB_ERROR",
        message: "Error while creating profile in database",
    },
    payloadError: {
        code: "PROFILE_PAYLOAD_ERROR",
        message: "Error while parsing request's payload",
    },
    updateDbError: {
        code: "UPDATE_PROFILE_DB_ERROR",
        message: "Error while updating profile in database",
    },
    deleteDbError: {
        code: "DELETE_PROFILE_DB_ERROR",
        message: "Error while deleting profile from database",
    },
    avatarUploadError: {
        code: "AVATAR_UPLOAD_ERROR",
        message: "Error while uploading avatar",
    },
};
