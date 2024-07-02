import { User } from "@prisma/client";

export type TAuthMeResponse = TApiResponse<{
    user: Pick<User, "id" | "email" | "role">;
}>;

export type TAuthLoginResponse = TApiResponse<{
    token: string;
    user: Pick<User, "id" | "email" | "role">;
}>;

export type TAuthRegisterResponse = TApiResponse<{
    token: string;
    user: Pick<User, "id" | "email" | "role">;
}>;

export type TChangePasswordResponse = TApiResponse<{
    affectedUserId: number;
    result: true;
}>;

export const authErrors = {
    missingCredentials: {
        code: "AUTH_MISSING_CREDENTIALS",
        message: "Missing credentials",
    },
    loginFailure: {
        code: "AUTH_LOGIN_FAILURE",
        message: "",
    },
    registerFailure: {
        code: "AUTH_REGISTER_FAILURE",
        message: "",
    },
    payloadError: {
        code: "AUTH_PAYLOAD_ERROR",
        message: "Error while parsing request's payload",
    },
    changePasswordFailure: {
        code: "AUTH_CHANGE_PASSWORD_FAILURE",
        message: "Error while changing password",
    },
    sendEmailFailure: {
        code: "AUTH_SEND_EMAIL_FAILURE",
        message: "Error while sending email",
    },
};
