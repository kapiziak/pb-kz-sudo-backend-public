import prisma from "../app/client";
import { TEntryService } from "../types/services/entry";
import facilityService from "./facilityService";

export const entryService: TEntryService = {
    getAllEntries: async () => {
        return prisma.entry.findMany({
            include: {
                relatedOccupancy: {
                    include: {
                        facility: true,
                    },
                },
                authorizedBy: {
                    select: {
                        email: true,
                    },
                },
                occupier: {
                    select: {
                        email: true,
                    },
                },
            },
            orderBy: {
                id: "desc",
            },
        });
    },
    getEntryById: async (id) => {
        return prisma.entry.findUnique({
            include: {
                relatedOccupancy: {
                    include: {
                        facility: true,
                    },
                },
                authorizedBy: {
                    select: {
                        email: true,
                    },
                },
                occupier: {
                    select: {
                        email: true,
                    },
                },
            },
            where: {
                id,
            },
        });
    },
    addEntry: async (
        facilities,
        entryAt,
        authorizedBy,
        occupierId,
        authorizationId
    ) => {
        if (await facilityService.checkFacilityIsOccupied(facilities))
            return { ok: false, status: "facilities-occupied" };

        const newEntry = await prisma.entry.create({
            data: {
                entryAt,
                authorizedById: authorizedBy,
                occupierId,
                authorizationId,
                relatedOccupancy: {
                    createMany: {
                        data: facilities.map((facility) => ({
                            facilityId: facility,
                            isOccupied: true,
                        })),
                    },
                },
            },
        });

        if (!newEntry)
            return {
                ok: false,
                status: "db-error",
            };

        return { ok: true, entry: newEntry };
    },
    releaseEntry: async (id) => {
        const foundEntry = await prisma.entry.findUnique({
            where: {
                id,
            },
        });

        if (!foundEntry) return false;

        if (foundEntry.releaseAt !== null) return false;

        const releasedEntry = await prisma.entry.update({
            where: {
                id,
            },
            data: {
                releaseAt: new Date(),
                relatedOccupancy: {
                    updateMany: {
                        data: {
                            isOccupied: false,
                        },
                        where: {
                            relatedEntryId: id,
                        },
                    },
                },
            },
        });

        return releasedEntry;
    },
    deleteEntry: async (id) => {
        const deletedOccupancies = await prisma.facilityOccupancy.deleteMany({
            where: {
                relatedEntryId: id,
            },
        });

        if (!deletedOccupancies) return false;

        const deletedEntry = await prisma.entry.delete({
            where: {
                id,
            },
        });

        if (!deletedEntry) return false;

        return {
            deletedId: deletedEntry.id,
        };
    },
    updateEntry: async (entry) => {
        const updatedEntry = await prisma.entry.update({
            where: {
                id: entry.id,
            },
            data: {
                authorizedById: entry.authorizedById,
                occupierId: entry.occupierId,
                authorizationId: entry.authorizationId,
            },
        });

        if (!updatedEntry) return false;

        return updatedEntry;
    },

    deleteOccupancy: async (args) => {
        let deletedOccupancy;

        deletedOccupancy = await prisma.facilityOccupancy.deleteMany({
            where:
                args.type === "by-occupancy-id"
                    ? {
                          id: args.occupancyId,
                      }
                    : {
                          facilityId: args.facilityId,
                      },
        });

        if (!deletedOccupancy) return false;

        // TODO: Fix it
        return {
            deletedId: -1,
        };
    },
    countAllTodayEntries: async () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date();
        tomorrow.setHours(23, 59, 59, 999);

        const count = await prisma.entry.count({
            where: {
                entryAt: {
                    gte: today,
                    lte: tomorrow,
                },
            },
        });

        return count;
    },
};
