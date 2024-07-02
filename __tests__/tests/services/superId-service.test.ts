import { superIdService } from "../../../src/services/superIdService";
import userService from "../../../src/services/userService";
import { generateSuperIdSecret } from "../../../src/utils/super-id";
import { usePrepareTestUser } from "../../helpers/prepare-test-user";

describe("Test superId service methods", () => {
    usePrepareTestUser({
        login: "foo@bar.com",
        password: "nyancat",
    });

    const prepareSuperIdWithUser = async () => {
        const users = await userService.getAllUsers();

        if (users.length < 0) {
            throw new Error("Not enough users");
        }

        const assignedUser = users[0];

        const generatedSecret = await generateSuperIdSecret();

        const response = await superIdService.createSuperId(
            assignedUser.id,
            new Date(),
            generatedSecret,
            "1234",
            "WIXXXXX",
            "AAABBBCCC"
        );

        return {
            response,
            generatedSecret,
            users,
            assignedUser,
        };
    };

    it("should add superId", async () => {
        const { generatedSecret, response, assignedUser } =
            await prepareSuperIdWithUser();

        expect(response).not.toBeFalsy();

        if (response) {
            const found = await superIdService.getUserSuperId(assignedUser.id);
            expect(found?.secret).toBe(generatedSecret);
            expect(found?.userId).toBe(assignedUser.id);
        } else {
            throw new Error("Response is falsy");
        }

        if (response) await superIdService.deleteSuperId(assignedUser.id);
    });

    it("should revoke existing superId", async () => {
        const { response, assignedUser } = await prepareSuperIdWithUser();

        expect(response).not.toBeFalsy();

        if (response) {
            const revoked = await superIdService.deleteSuperId(assignedUser.id);
            expect(revoked).not.toBeNull();

            const found = await superIdService.getUserSuperId(assignedUser.id);
            expect(found).toBeFalsy();
        } else {
            throw new Error("Response is falsy");
        }
    });
});
