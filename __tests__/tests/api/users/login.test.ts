import request from "supertest";
import app from "../../../../src/app";
import userService from "../../../../src/services/userService";
import { prismaMock } from "../../../../src/app/mocked-client";
import { TAuthLoginResponse } from "../../../../src/types/api/auth/auth-responses";
import { usePrepareTestUser } from "../../../helpers/prepare-test-user";
import { useLoginTestUser } from "../../../helpers/login-as-test-user";
import { useLogoutTestUser } from "../../../helpers/logout-test-user";

describe("Test users/login api endpoint path", () => {
    usePrepareTestUser({
        login: "foo@bar.com",
        password: "foobar",
    });

    it("should return 401", async () => {
        let response;

        response = await request(app).post("/api/auth/login").send({
            login: "hello@kzakrzewski.pl",
            password: "hello@kzakrzewski.pl",
        });

        expect(response.status).toBe(401);

        response = await request(app).post("/api/auth/login").send({
            login: "foo@bar.com",
            password: "invalid_password",
        });

        expect(response.status).toBe(401);
    });

    it("should return 400 when missing credentials", async () => {
        let response;

        response = await request(app).post("/api/auth/login").send({
            login: "",
        });
        expect(response.status).toBe(400);

        response = await request(app).post("/api/auth/login").send({
            password: "",
        });
        expect(response.status).toBe(400);

        response = await request(app).post("/api/auth/login").send();
        expect(response.status).toBe(400);
    });

    it("should return 200 when user gets logged in", async () => {
        const userData = await useLoginTestUser({
            login: "foo@bar.com",
            password: "foobar",
        });

        let response;
        response = await request(app)
            .get("/api/auth/me")
            .set("Bearer", `${userData.token}`)
            .send();

        expect(response.status).toBe(200);

        useLogoutTestUser();
    });
});
