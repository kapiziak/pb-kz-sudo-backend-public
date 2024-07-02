import { PrismaClient } from "@prisma/client";
import { TChallengeService } from "../types/services/challenge";
import { ConfigSuperId } from "../../config/super-id";
import { v4 as uuidv4 } from "uuid";
import prisma from "../app/client";

export const challengeService: TChallengeService = {
    createChallenge: async (superId) => {
        const challenge = await prisma.superIdChallenge.create({
            data: {
                superIdId: superId,
                challengeId: uuidv4(),
                validTo: new Date(
                    Date.now() + ConfigSuperId.CHALLENGE_VALID_TIME
                ),
            },
        });

        if (!challenge) return null;

        return {
            challengeId: challenge.challengeId,
        };
    },
    sendChallenge: async (challengeId, pin) => {
        const challengeResponse = await prisma.superIdChallenge.findFirst({
            include: {
                superId: true,
            },
            where: {
                challengeId,
                superId: {
                    pin,
                },
            },
        });

        if (!challengeResponse) return null;

        if (challengeResponse.validTo < new Date()) {
            throw new Error("Challenge expired");
        }

        const user = await prisma.user.findUnique({
            where: {
                id: challengeResponse.superId.userId,
            },
            select: {
                id: true,
                email: true,
                role: true,
            },
        });

        if (!user) {
            throw new Error("User not found");
        }

        const profile = await prisma.profile.findFirst({
            where: {
                userId: challengeResponse.superId.userId,
            },
        });

        const authorizations = await prisma.authorization.findMany({
            where: {
                assignedUsers: {
                    some: {
                        id: challengeResponse.superId.userId,
                    },
                },
            },
            include: {
                scopeFacility: true,
            },
        });

        return {
            authorizations,
            profile,
            user,
        };
    },
};
