import { usePrepareTestUser } from "../../../helpers/prepare-test-user";
import app from "../../../../src/app";
import request from "supertest";
import { useLoginTestUser } from "../../../helpers/login-as-test-user";
import { usePrepareTestAuthorization } from "../../../helpers/prepare-test-authorization";
import { usePrepareTestFacility } from "../../../helpers/prepare-test-facility";
import authorizationService from "../../../../src/services/authorizationService";
import { entryService } from "../../../../src/services/entryService";

describe("Test entry CRUD", () => {
    const userPromise1 = usePrepareTestUser({
        login: "foo@bar.com",
        password: "foobar",
        role: "VISITOR",
    });

    const userPromise2 = usePrepareTestUser({
        login: "foo2@bar.com",
        password: "foobar",
        role: "EMPLOYEE",
    });

    const facilityPromise1 = usePrepareTestFacility({
        name: "Room 1",
    });

    const facilityPromise2 = usePrepareTestFacility({
        name: "Room 2",
    });

    it("should return 401 for not logged in user", async () => {
        let response;

        response = await request(app).get("/api/entry");
        expect(response.status).toBe(401);

        response = await request(app).post("/api/entry");
        expect(response.status).toBe(401);

        response = await request(app).post("/api/entry/release/1");
        expect(response.status).toBe(401);
    });

    it("should return 403 for not privilaged user", async () => {
        let response;

        const userData = await useLoginTestUser({
            login: "foo@bar.com",
            password: "foobar",
        });

        response = await request(app).get("/api/entry");
        expect(response.status).toBe(401);

        response = await request(app).post("/api/entry");
        expect(response.status).toBe(401);

        response = await request(app).post("/api/entry/release/1");
        expect(response.status).toBe(401);
    });

    it("should return 200 for privilaged user", async () => {
        let response;

        const userData = await useLoginTestUser({
            login: "foo2@bar.com",
            password: "foobar",
        });

        response = await request(app)
            .get("/api/entry")
            .set("Bearer", `${userData.token}`)
            .send();
        expect(response.status).not.toBe(401);

        response = await request(app)
            .post("/api/entry")
            .set("Bearer", `${userData.token}`)
            .send();
        expect(response.status).not.toBe(401);

        response = await request(app)
            .post("/api/entry/release/1")
            .set("Bearer", `${userData.token}`)
            .send();
        expect(response.status).not.toBe(401);
    });

    it("should add entry and release it", async () => {
        const authorization = await authorizationService.addAuthorization({
            assignedUsers: [await userPromise1, await userPromise2],
            expireAt: new Date(),
            scopeFacility: [await facilityPromise1, await facilityPromise2],
            createdByUserId: await userPromise2,
        });

        if (!authorization) throw new Error("Authorization not created");

        let response;

        const userData = await useLoginTestUser({
            login: "foo2@bar.com",
            password: "foobar",
        });

        response = await request(app)
            .post("/api/entry")
            .set("Bearer", `${userData.token}`)
            .send({
                facilities: await Promise.all([
                    facilityPromise1,
                    facilityPromise2,
                ]),
                occupierId: await userPromise1,
                authorizationId: authorization.id,
            });

        expect(response.status).toBe(200);
        expect(response.body.data.entry.authorizationId).toBe(1);

        response = await request(app)
            .post(`/api/entry/release/${response.body.data.entry.id}`)
            .set("Bearer", `${userData.token}`)
            .send();

        expect(response.status).toBe(200);
        expect(response.body.data.entry.releaseAt).not.toBeNull();

        await entryService.deleteOccupancy({
            type: "by-facility-id",
            facilityId: await facilityPromise1,
        });
        await entryService.deleteOccupancy({
            type: "by-facility-id",
            facilityId: await facilityPromise2,
        });
        await entryService.deleteEntry(response.body.data.entry.id);
        await authorizationService.deleteAuthorization(authorization.id);
    });
});
