import userService from "../../../src/services/userService";
import { usePrepareTestUser } from "../../helpers/prepare-test-user";

describe("Test user service methods", () => {
    const userId = usePrepareTestUser({
        login: "foo@bar.com",
        password: "foobar",
    });

    it("should return all users", async () => {
        const users = await userService.getAllUsers();
        expect(users.length).toBeGreaterThan(0);
    });

    it("should login user", async () => {
        const response = await userService.login("foo@bar.com", "foobar");
        expect(response.ok).toBe(true);
    });

    it("should not login user", async () => {
        const response = await userService.login(
            "foo@bar.com",
            "invalid_password"
        );
        expect(response.ok).toBe(false);
    });

    it("should register user", async () => {
        const response = await userService.register("foo2@bar.com", "foobar");
        expect(response.ok).toBe(true);

        if (response.ok) await userService.delete(response.user.id);
    });

    it("should change password", async () => {
        let response;

        response = await userService.login("foo@bar.com", "foobar");
        expect(response.ok).toBe(true);

        await userService.changePassword(await userId, "foobar2");
        response = await userService.login("foo@bar.com", "foobar2");
        expect(response.ok).toBe(true);

        response = await userService.login("foo@bar.com", "foobar");
        expect(response.ok).toBe(false);
    });
});
