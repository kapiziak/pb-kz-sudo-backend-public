import request from "supertest";
import app from "../../../../src/app";
import { profileService } from "../../../../src/services/profileService";
import { useLoginTestUser } from "../../../helpers/login-as-test-user";
import { usePrepareTestUser } from "../../../helpers/prepare-test-user";

describe("Test profile CRUD", () => {
    const userId = usePrepareTestUser({
        login: "foo@bar.com",
        password: "foobar",
    });

    it("should return 401 for not logged in user", async () => {
        let response;

        response = await request(app).get("/api/profile");
        expect(response.status).toBe(401);

        response = await request(app).post("/api/profile");
        expect(response.status).toBe(401);

        response = await request(app).put("/api/profile");
        expect(response.status).toBe(401);

        response = await request(app).delete("/api/profile");
        expect(response.status).toBe(401);
    });

    it("should return 200 for logged in user", async () => {
        const userData = await useLoginTestUser({
            login: "foo@bar.com",
            password: "foobar",
        });

        let response;
        response = await request(app)
            .get("/api/profile")
            .set("Bearer", `${userData.token}`)
            .send();
        expect(response.status).toBe(200);
    });

    it("should add user profile", async () => {
        const userData = await useLoginTestUser({
            login: "foo@bar.com",
            password: "foobar",
        });

        let response;
        response = await request(app)
            .post("/api/profile")
            .set("Bearer", `${userData.token}`)
            .send({
                firstName: "Foo",
                surname: "Bar",
                description: "Test description",
            });

        expect(response.status).toBe(200);
        expect(response.body.data.profile.firstName).toBe("Foo");
        expect(response.body.data.profile.surname).toBe("Bar");
        expect(response.body.data.profile.description).toBe("Test description");

        await profileService.deleteUserProfile(await userId);
    });

    it("should return validation error on invalid create payload", async () => {
        const userData = await useLoginTestUser({
            login: "foo@bar.com",
            password: "foobar",
        });

        let response;
        response = await request(app)
            .post("/api/profile")
            .set("Bearer", `${userData.token}`)
            .send({
                surname: "Bar",
                description: "Test description",
            });

        expect(response.status).toBe(400);
    });

    it("should update user profile", async () => {
        const userData = await useLoginTestUser({
            login: "foo@bar.com",
            password: "foobar",
        });

        let response;

        response = await request(app)
            .post("/api/profile")
            .set("Bearer", `${userData.token}`)
            .send({
                firstName: "Foo",
                surname: "Bar",
                description: "Test description",
            });

        expect(response.status).toBe(200);

        response = await request(app)
            .put("/api/profile")
            .set("Bearer", `${userData.token}`)
            .send({
                surname: "Modified",
            });

        expect(response.status).toBe(200);
        expect(response.body.data.profile.firstName).toBe("Foo");
        expect(response.body.data.profile.surname).toBe("Modified");
        expect(response.body.data.profile.description).toBe("Test description");

        await profileService.deleteUserProfile(await userId);
    });
});
