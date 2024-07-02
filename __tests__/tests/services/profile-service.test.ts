import { profileService } from "../../../src/services/profileService";
import { usePrepareTestUser } from "../../helpers/prepare-test-user";

describe("Test profile service methods", () => {
    const userId = usePrepareTestUser({
        login: "foo@bar.com",
        password: "nyancat",
    });

    it("should create user profile", async () => {
        const response = await profileService.createUserProfile(await userId, {
            firstName: "Foo",
            surname: "Bar",
            description: "Test description",
            avatarUrl: null,
        });

        expect(response).not.toBeFalsy();

        if (response) {
            expect(response.firstName).toBe("Foo");
            expect(response.surname).toBe("Bar");
            expect(response.description).toBe("Test description");
        } else {
            throw new Error("Response is falsy");
        }

        if (response) await profileService.deleteUserProfile(await userId);
    });

    it("should return user profile", async () => {
        const response = await profileService.createUserProfile(await userId, {
            firstName: "Foo2",
            surname: "Bar2",
            description: "Test description2",
            avatarUrl: null,
        });

        expect(response).not.toBeFalsy();

        const getResponse = await profileService.getUserProfile(await userId);

        expect(getResponse).not.toBeNull();

        if (response && getResponse) {
            expect(getResponse.firstName).toBe("Foo2");
            expect(getResponse.surname).toBe("Bar2");
            expect(getResponse.description).toBe("Test description2");
        } else {
            throw new Error("Response is falsy");
        }

        if (response) await profileService.deleteUserProfile(await userId);
    });

    it("should update user profile", async () => {
        const response = await profileService.createUserProfile(await userId, {
            firstName: "Foo3",
            surname: "Bar3",
            description: "Test description3",
            avatarUrl: null,
        });

        expect(response).not.toBeFalsy();

        const updated = await profileService.updateUserProfile(await userId, {
            firstName: "Grzegorz",
            surname: "Brzęczyszczykiewicz",
            description: "Szczebrzeszyn Developer",
        });

        expect(updated).not.toBeNull();

        if (response && updated) {
            expect(updated.firstName).toBe("Grzegorz");
            expect(updated.surname).toBe("Brzęczyszczykiewicz");
            expect(updated.description).toBe("Szczebrzeszyn Developer");
        } else {
            throw new Error("Response is falsy");
        }

        if (response) await profileService.deleteUserProfile(await userId);
    });

    it("should delete user profile", async () => {
        const response = await profileService.createUserProfile(await userId, {
            firstName: "Foo",
            surname: "Bar",
            description: "Test description4",
            avatarUrl: null,
        });

        expect(response).not.toBeFalsy();

        const deleted = await profileService.deleteUserProfile(await userId);

        expect(deleted).not.toBeNull();

        if (response && deleted) {
            expect(deleted.deletedId).toBe(response.id);

            const found = await profileService.getUserProfile(await userId);
            expect(found).toBeNull();
        } else {
            throw new Error("Response is falsy");
        }
    });
});
