import { Entry } from "@prisma/client";

export type TEntryService = {
    getAllEntries: () => Promise<Entry[]>;
    getEntryById: (id: number) => Promise<Entry | null>;
    addEntry: (
        facilities: number[],
        entryAt: Date,
        authorizedBy: number,
        occupierId: number,
        authorizationId?: number
    ) => Promise<
        | { ok: true; entry: Entry }
        | { ok: false; status: "facilities-occupied" | "db-error" }
    >;
    updateEntry: (
        entry: { id: number } & Partial<Omit<Entry, "id">>
    ) => Promise<Entry | false>;
    releaseEntry: (id: number) => Promise<Entry | false>;
    deleteEntry: (id: number) => Promise<{ deletedId: number } | false>;
    deleteOccupancy: (
        args:
            | { type: "by-occupancy-id"; occupancyId: number }
            | { type: "by-facility-id"; facilityId: number }
    ) => Promise<{ deletedId: number } | false>;
    countAllTodayEntries: () => Promise<number>;
};
