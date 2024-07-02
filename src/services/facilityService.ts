import { PrismaClient } from "@prisma/client";
import { TServiceFacility } from "../types/services/facility";
import prisma from "../app/client";

const facilityService: TServiceFacility = {
    getAllFacilities: async () => {
        return prisma.facility.findMany({
            include: {
                occupancy: {
                    where: {
                        isOccupied: true,
                    },
                },
            },
            orderBy: {
                id: "asc",
            },
        });
    },
    getFacilityById: async (id) => {
        return prisma.facility.findUnique({
            where: {
                id,
            },
        });
    },
    addFacility: async (facility) => {
        const newFacility = await prisma.facility.create({
            data: {
                name: facility.name,
            },
        });

        if (!newFacility) return false;

        return newFacility;
    },
    updateFacility: async (facility) => {
        const updatedFacility = await prisma.facility.update({
            where: {
                id: facility.id,
            },
            data: {
                name: facility.name,
            },
        });

        if (!updatedFacility) return false;

        return updatedFacility;
    },
    deleteFacility: async (id) => {
        const deletedFacility = await prisma.facility.delete({
            where: {
                id,
            },
        });

        if (!deletedFacility) return false;

        return {
            deletedId: deletedFacility.id,
        };
    },
    getFacilityOccupancy: async (id) => {
        const occupancy = prisma.facilityOccupancy.findMany({
            where: {
                facilityId: id,
                isOccupied: true,
            },
        });

        if (!occupancy) return false;

        return occupancy;
    },
    checkFacilityIsOccupied: async (facilityIds) => {
        const found = await prisma.facilityOccupancy.findMany({
            where: {
                facilityId: {
                    in: facilityIds,
                },
                isOccupied: true,
            },
        });

        return found.length > 0;
    },
    releaseFacilityOccupancy: async (facilityId) => {
        const foundOccupancy = await prisma.facilityOccupancy.findFirst({
            where: {
                facilityId,
                isOccupied: true,
            },
        });

        if (!foundOccupancy) return false;

        const released = await prisma.facilityOccupancy.update({
            where: {
                id: foundOccupancy.id,
            },
            data: {
                isOccupied: false,
            },
        });

        if (!released) return false;

        await prisma.entry.updateMany({
            where: {
                id: released.relatedEntryId,
                relatedOccupancy: {
                    every: {
                        isOccupied: false,
                    },
                },
            },
            data: {
                releaseAt: new Date(),
            },
        });

        return true;
    },
    countAllActiveOccupancy: async () => {
        const count = await prisma.facilityOccupancy.count({
            where: {
                isOccupied: true,
            },
        });

        return count;
    },
};

export default facilityService;
