import authorizationService from "../../../src/services/authorizationService";
import userService from "../../../src/services/userService";
import { usePrepareTestUser } from "../../helpers/prepare-test-user";

describe("Test authorization service methods", () => {
    const user1 = usePrepareTestUser({
        login: "user1@bar.com",
        password: "weak_password",
    });

    const user2 = usePrepareTestUser({
        login: "user2@bar.com",
        password: "weak_password",
    });

    it("should add authorization", async () => {
        const users = await userService.getAllUsers();

        if (users.length < 2) {
            throw new Error("Not enough users");
        }

        const response = await authorizationService.addAuthorization({
            assignedUsers: [users[0].id],
            createdByUserId: users[1].id,
            expireAt: new Date(),
            scopeFacility: [],
        });

        expect(response).not.toBeFalsy();

        if (response) {
            const found = await authorizationService.getAuthorizationById(
                response.id
            );

            expect(found?.createdByUserId).toBe(users[1].id);
        } else {
            throw new Error("Response is falsy");
        }

        if (response)
            await authorizationService.deleteAuthorization(response.id);
    });

    it("should update authorization", async () => {
        const users = await userService.getAllUsers();

        if (users.length < 2) {
            throw new Error("Not enough users");
        }

        const response = await authorizationService.addAuthorization({
            assignedUsers: [users[0].id],
            createdByUserId: users[1].id,
            expireAt: new Date(),
            scopeFacility: [],
        });

        expect(response).not.toBeFalsy();

        if (response) {
            const updated = await authorizationService.updateAuthorization({
                id: response.id,
                assignedUsers: [users[1].id],
                createdByUserId: users[0].id,
                expireAt: new Date(),
                scopeFacility: [],
            });

            if (updated) {
                expect(updated.createdByUserId).toBe(users[0].id);
                expect(updated.assignedUsers[0].id).toBe(users[1].id);
            } else throw new Error("Updated authorization is falsy");
        } else {
            throw new Error("Response is falsy");
        }

        if (response)
            await authorizationService.deleteAuthorization(response.id);
    });

    it("should delete authorization", async () => {
        const users = await userService.getAllUsers();

        if (users.length < 2) {
            throw new Error("Not enough users");
        }

        const response = await authorizationService.addAuthorization({
            assignedUsers: [users[0].id],
            createdByUserId: users[1].id,
            expireAt: new Date(),
            scopeFacility: [],
        });

        expect(response).not.toBeFalsy();

        if (response) {
            const deleted = await authorizationService.deleteAuthorization(
                response.id
            );

            if (deleted) expect(deleted.deletedId).toBe(response.id);
            else throw new Error("Deleted authorization is falsy");

            const found = await authorizationService.getAuthorizationById(
                response.id
            );
            expect(found).toBeFalsy();

            const list = await authorizationService.getAllAuthorizations();
            expect(list.findIndex((x) => x.id === response.id)).toBe(-1);
        } else {
            throw new Error("Response is falsy");
        }
    });
});
