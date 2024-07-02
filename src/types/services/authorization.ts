import { Authorization } from "@prisma/client";

export type TServiceAuthorization = {
    getAllAuthorizations: () => Promise<Authorization[]>;
    getUserAuthorizations: (userId: number) => Promise<Authorization[]>;
    getAuthorizationById: (id: number) => Promise<Authorization | null>;
    addAuthorization: (
        authorization: Omit<Authorization, "id" | "createdAt"> & {
            scopeFacility: number[];
            assignedUsers: number[];
        }
    ) => Promise<Authorization | false>;
    updateAuthorization: (
        authorization: Pick<Authorization, "id"> &
            Partial<
                Pick<Authorization, "createdByUserId" | "expireAt"> & {
                    scopeFacility: number[];
                    assignedUsers: number[];
                }
            >
    ) => Promise<
        (Authorization & { assignedUsers: Array<{ id: number }> }) | false
    >;
    deleteAuthorization: (id: number) => Promise<{ deletedId: number } | false>;
    countAllValidAuthorizations: () => Promise<number>;
};
