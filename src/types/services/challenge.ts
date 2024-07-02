import { Authorization, Facility, Profile, User } from "@prisma/client";
import { TSuperIdService } from "./superId";

export type TChallengeService = {
    createChallenge: (superId: number) => Promise<{
        challengeId: string;
    } | null>;
    sendChallenge: (
        challengeId: string,
        pin: string
    ) => Promise<{
        authorizations: Array<Authorization & { scopeFacility: Facility[] }>;
        user: Pick<User, "id" | "email" | "role">;
        profile: Profile | null;
    } | null>;
};
