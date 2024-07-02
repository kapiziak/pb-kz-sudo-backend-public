import prisma from "../app/client";
import { TProfileService } from "../types/services/profile";

export const profileService: TProfileService = {
    getUserProfile: async (userId) => {
        return prisma.profile.findUnique({
            where: {
                userId,
            },
        });
    },
    createUserProfile: async (userId, profile) => {
        const newProfile = await prisma.profile.create({
            data: {
                ...profile,
                user: {
                    connect: {
                        id: userId,
                    },
                },
            },
        });

        if (!newProfile) return false;

        return newProfile;
    },
    updateUserProfile: async (userId, profile) => {
        const updatedProfile = await prisma.profile.update({
            where: {
                userId,
            },
            data: {
                ...profile,
            },
        });

        if (!updatedProfile) return false;

        return updatedProfile;
    },
    deleteUserProfile: async (userId) => {
        const deletedProfile = await prisma.profile.delete({
            where: {
                userId,
            },
        });

        if (!deletedProfile) return false;

        return {
            deletedId: deletedProfile.id,
        };
    },
    setUserAvatar: async (userId, avatarUrl) => {
        const updatedProfile = await prisma.profile.update({
            where: {
                userId,
            },
            data: {
                avatarUrl,
            },
        });

        if (!updatedProfile) return false;

        return updatedProfile;
    },
};
