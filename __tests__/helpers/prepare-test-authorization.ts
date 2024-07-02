import authorizationService from "../../src/services/authorizationService";
import userService from "../../src/services/userService";

interface Data {
    assignedUsers: Array<Promise<number>>;
    scopeFacility: Array<Promise<number>>;
    expireAt: Date;
    createdByUserId: Promise<number>;
}

export const usePrepareTestAuthorization = ({
    assignedUsers,
    expireAt,
    scopeFacility,
    createdByUserId,
}: Data): Promise<number> => {
    return new Promise((resolve, reject) => {
        let authorizationId = -1;

        beforeAll(async () => {
            const res = await authorizationService.addAuthorization({
                assignedUsers: await Promise.all(assignedUsers),
                expireAt,
                scopeFacility: await Promise.all(scopeFacility),
                createdByUserId: await createdByUserId,
            });

            expect(res).not.toBeFalsy();

            if (res) {
                authorizationId = res.id;
                resolve(res.id);
            }
        });

        afterAll(async () => {
            console.log("Delete auth");
            expect(
                await authorizationService.deleteAuthorization(authorizationId)
            );
        });
    });
};
