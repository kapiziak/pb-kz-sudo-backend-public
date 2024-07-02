import app from "../../../../src/app";
import { useLoginTestUser } from "../../../helpers/login-as-test-user";
import { usePrepareTestUser } from "../../../helpers/prepare-test-user";
import request from "supertest";

describe("Test statistics endpoint", () => {
    const userPromise1 = usePrepareTestUser({
        login: "foo@bar.com",
        password: "foobar",
    });

    const userPromise2 = usePrepareTestUser({
        login: "foo2@bar.com",
        password: "foobar",
        role: "EMPLOYEE",
    });

    it("should return 401 for not logged in user", async () => {
        let response;

        response = await request(app).get("/api/statistics/all");
        expect(response.status).toBe(401);
    });

    it("should return 403 for not logged in user", async () => {
        let response;

        const userData = await useLoginTestUser({
            login: "foo@bar.com",
            password: "foobar",
        });

        response = await request(app)
            .get("/api/statistics/all")
            .set("Bearer", `${userData.token}`)
            .send();

        expect(response.status).toBe(403);
    });

    it("should return all statistics for logged in user", async () => {
        let response;

        const userData = await useLoginTestUser({
            login: "foo2@bar.com",
            password: "foobar",
        });

        response = await request(app)
            .get("/api/statistics/all")
            .set("Bearer", `${userData.token}`)
            .send();

        expect(response.status).toBe(200);
        expect(response.body.data.activeAuthorizations).toBeGreaterThanOrEqual(
            0
        );
        expect(response.body.data.todayEntries).toBeGreaterThanOrEqual(0);
        expect(response.body.data.occupiedFacilities).toBeGreaterThanOrEqual(0);
    });
});
