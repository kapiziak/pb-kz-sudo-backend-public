import { Facility, FacilityOccupancy } from "@prisma/client";

export type TServiceFacility = {
    getAllFacilities: () => Promise<Facility[]>;
    getFacilityById: (id: number) => Promise<Facility | null>;
    addFacility: (
        facility: Pick<Facility, "name">
    ) => Promise<Facility | false>;
    updateFacility: (
        facility: Pick<Facility, "id" | "name">
    ) => Promise<Facility | false>;
    deleteFacility: (id: number) => Promise<{ deletedId: number } | false>;
    getFacilityOccupancy: (id: number) => Promise<FacilityOccupancy[] | false>;
    checkFacilityIsOccupied: (facilityIds: number[]) => Promise<boolean>;
    releaseFacilityOccupancy: (facilityId: number) => Promise<boolean>;
    countAllActiveOccupancy: () => Promise<number>;
};
