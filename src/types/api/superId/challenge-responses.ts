import { Authorization, Facility, Profile, User } from "@prisma/client";
import { challengeService } from "../../../services/challengeService";
import { TChallengeService } from "../../services/challenge";
import TApiError from "../errors/api-errors";

export type TSendChallengeResponse = TApiResponse<{
    authorizations: Array<
        Authorization & {
            scopeFacility: Facility[];
        }
    >;
    user: Pick<User, "id" | "email" | "role">;
    profile: Profile | null;
}>;

export const challengeErrors: Record<
    "payloadError" | "controllerError" | "challengeNotMatching",
    TApiError
> = {
    payloadError: {
        code: "CHALLENGE_PAYLOAD_ERROR",
        message: "Error while parsing request's payload",
    },
    controllerError: {
        code: "CHALLENGE_CONTROLLER_ERROR",
        message: "Error while parsing challenge: ",
    },
    challengeNotMatching: {
        code: "CHALLENGE_NOT_MATCHING",
        message: "Challenge not matching",
    },
};
