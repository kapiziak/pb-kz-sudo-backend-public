import prisma from "../app/client";
import { TServiceAuthorization } from "../types/services/authorization";

const authorizationService: TServiceAuthorization = {
    getAllAuthorizations: async () => {
        return prisma.authorization.findMany({
            orderBy: {
                id: "asc",
            },
            include: {
                scopeFacility: true,
                createdBy: {
                    select: {
                        email: true,
                    },
                },
                assignedUsers: {
                    select: {
                        id: true,
                        email: true,
                    },
                },
            },
        });
    },
    getUserAuthorizations: async (userId) => {
        return prisma.authorization.findMany({
            where: {
                assignedUsers: {
                    some: {
                        id: userId,
                    },
                },
            },
            orderBy: {
                id: "asc",
            },
            include: {
                scopeFacility: true,
                createdBy: {
                    select: {
                        email: true,
                    },
                },
                assignedUsers: {
                    select: {
                        id: true,
                        email: true,
                    },
                },
            },
        });
    },
    getAuthorizationById: async (id) => {
        return prisma.authorization.findUnique({
            where: {
                id,
            },
        });
    },
    addAuthorization: async (authorization) => {
        const { scopeFacility, assignedUsers, ...authorizationData } =
            authorization;
        const newAuthorization = await prisma.authorization.create({
            data: {
                ...authorizationData,
                scopeFacility: {
                    connect: scopeFacility.map((x) => ({
                        id: x,
                    })),
                },
                assignedUsers: {
                    connect: assignedUsers.map((x) => ({
                        id: x,
                    })),
                },
            },
            include: {
                scopeFacility: true,
                assignedUsers: {
                    select: {
                        id: true,
                    },
                },
            },
        });

        if (!newAuthorization) return false;

        return newAuthorization;
    },
    updateAuthorization: async (authorization) => {
        const { scopeFacility, assignedUsers, ...authorizationData } =
            authorization;

        const updatedAuthorization = await prisma.authorization.update({
            where: {
                id: authorization.id,
            },
            data: {
                ...authorizationData,
                scopeFacility: scopeFacility
                    ? {
                          set: scopeFacility.map((x) => ({
                              id: x,
                          })),
                      }
                    : undefined,
                assignedUsers: assignedUsers
                    ? {
                          set: assignedUsers.map((x) => ({
                              id: x,
                          })),
                      }
                    : undefined,
            },
            include: {
                scopeFacility: true,
                assignedUsers: {
                    select: {
                        id: true,
                    },
                },
            },
        });

        if (!updatedAuthorization) return false;

        return updatedAuthorization;
    },
    deleteAuthorization: async (id) => {
        const deletedAuthorization = await prisma.authorization.delete({
            where: {
                id,
            },
        });

        if (!deletedAuthorization) return false;

        return {
            deletedId: deletedAuthorization.id,
        };
    },
    countAllValidAuthorizations: async () => {
        const count = await prisma.authorization.count({
            where: {
                expireAt: {
                    lt: new Date(),
                },
            },
        });

        return count;
    },
};

export default authorizationService;
