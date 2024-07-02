import { Profile } from "@prisma/client";

export type TProfileService = {
    getUserProfile: (userId: number) => Promise<Profile | null>;
    createUserProfile: (
        userId: number,
        profile: Omit<Profile, "id" | "userId">
    ) => Promise<Profile | false>;
    updateUserProfile: (
        userId: number,
        profile: Omit<Partial<Profile>, "id" | "userId">
    ) => Promise<Profile | false>;
    deleteUserProfile: (
        userId: number
    ) => Promise<{ deletedId: number } | false>;
    setUserAvatar: (
        userId: number,
        avatarUrl: string
    ) => Promise<Profile | false>;
};
