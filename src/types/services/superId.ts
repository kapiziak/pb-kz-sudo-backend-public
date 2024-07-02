import { SuperId } from "@prisma/client";

export type TSuperIdService = {
    getUserSuperId: (
        userId: number
    ) => Promise<Pick<SuperId, "id" | "userId" | "validTo" | "secret"> | null>;
    getSuperIdBySecret: (
        secret: string
    ) => Promise<Pick<
        SuperId,
        "id" | "userId" | "validTo" | "secret" | "identityCardId" | "studentId"
    > | null>;
    getIdentityCardInformation: (
        secret: string,
        userId: number
    ) => Promise<Pick<SuperId, "identityCardId"> | null>;
    getStudentCardInformation: (
        secret: string,
        userId: number
    ) => Promise<Pick<SuperId, "studentId"> | null>;
    createSuperId: (
        userId: number,
        validTo: Date,
        secret: string,
        pin?: string,
        studentId?: string,
        identityCardId?: string
    ) => Promise<SuperId | null>;
    deleteSuperId: (userId: number) => Promise<{
        deletedId: number;
    } | null>;
    updateSuperId: (data: {
        userId: number;
        newSecret: string;
        pin?: string;
        studentId?: string;
        identityCardId?: string;
    }) => Promise<Pick<SuperId, "id" | "userId" | "validTo" | "secret"> | null>;
};
