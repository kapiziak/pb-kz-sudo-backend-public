import { PrismaClient } from "@prisma/client";
import { TSuperIdService } from "../types/services/superId";
import prisma from "../app/client";

export const superIdService: TSuperIdService = {
    getUserSuperId: async (userId) => {
        const superId = await prisma.superId.findFirst({
            select: {
                id: true,
                userId: true,
                validTo: true,
                secret: true,
            },
            where: {
                userId,
            },
        });

        if (!superId) return null;

        return superId;
    },
    getSuperIdBySecret: async (secret) => {
        const superId = await prisma.superId.findFirst({
            select: {
                id: true,
                userId: true,
                validTo: true,
                secret: true,
                identityCardId: true,
                studentId: true,
            },
            where: {
                secret,
            },
        });

        if (!superId) return null;

        return superId;
    },
    getIdentityCardInformation: async (secret, userId) => {
        const superId = await prisma.superId.findFirst({
            select: {
                identityCardId: true,
            },
            where: {
                secret,
                userId,
            },
        });

        if (!superId) return null;

        return superId;
    },
    getStudentCardInformation: async (secret, userId) => {
        const superId = await prisma.superId.findFirst({
            select: {
                studentId: true,
            },
            where: {
                secret,
                userId,
            },
        });

        if (!superId) return null;

        return superId;
    },
    createSuperId: async (
        userId,
        validTo,
        secret,
        pin,
        studentId,
        identityCardId
    ) => {
        const superId = await prisma.superId.create({
            data: {
                userId,
                validTo,
                secret,
                pin,
                studentId,
                identityCardId,
            },
        });

        if (!superId) return null;

        return superId;
    },
    deleteSuperId: async (userId) => {
        const deletedSuperId = await prisma.superId.delete({
            where: {
                userId,
            },
        });

        if (!deletedSuperId) return null;

        return {
            deletedId: deletedSuperId.id,
        };
    },
    updateSuperId: async (data) => {
        const { userId, newSecret, pin, studentId, identityCardId } = data;
        const updatedObj = await prisma.superId.update({
            select: {
                id: true,
                userId: true,
                validTo: true,
                secret: true,
                pin: true,
            },

            where: {
                userId,
            },
            data: {
                secret: newSecret,
                pin,
                studentId,
                identityCardId,
            },
        });

        if (!updatedObj) return null;

        return updatedObj;
    },
};
