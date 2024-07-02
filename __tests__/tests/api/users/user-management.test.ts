import request from "supertest";
import app from "../../../../src/app";
import { useLoginTestUser } from "../../../helpers/login-as-test-user";
import { useLogoutTestUser } from "../../../helpers/logout-test-user";
import { usePrepareTestUser } from "../../../helpers/prepare-test-user";

describe("Test users/ api endpoint path", () => {
    usePrepareTestUser({
        login: "foo@bar.com",
        password: "foobar",
    });

    usePrepareTestUser({
        login: "foo_admin@bar.com",
        password: "foobar",
        role: "ADMIN",
    });

    describe("Test users list", () => {
        it("should return 401 for not logged in user", async () => {
            let response;
            response = await request(app).get("/api/users");

            expect(response.status).toBe(401);
        });

        it("should return 401 for not privilaged user", async () => {
            const userData = await useLoginTestUser({
                login: "foo@bar.com",
                password: "foobar",
            });

            let response;
            response = await request(app)
                .get("/api/users")
                .set("Bearer", `${userData.token}`)
                .send();

            expect(response.status).toBe(403);

            useLogoutTestUser();
        });

        it("should return 401 for not privilaged user", async () => {
            const userData = await useLoginTestUser({
                login: "foo@bar.com",
                password: "foobar",
            });

            let response;
            response = await request(app)
                .get("/api/users")
                .set("Bearer", `${userData.token}`)
                .send();

            expect(response.status).toBe(403);

            useLogoutTestUser();
        });

        it("should return 200 on privilaged user", async () => {
            const userData = await useLoginTestUser({
                login: "foo_admin@bar.com",
                password: "foobar",
            });

            let response;
            response = await request(app)
                .get("/api/users")
                .set("Bearer", `${userData.token}`)
                .send();

            expect(response.status).toBe(200);

            useLogoutTestUser();
        });
    });
});
