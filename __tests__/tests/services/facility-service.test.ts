import facilityService from "../../../src/services/facilityService";

describe("Test facility service methods", () => {
    it("should add facility", async () => {
        const response = await facilityService.addFacility({
            name: "Test facility",
        });

        expect(response).not.toBeFalsy();

        if (response) {
            const found = await facilityService.getFacilityById(response.id);
            expect(found?.name).toBe("Test facility");
        } else {
            throw new Error("Response is falsy");
        }

        if (response) await facilityService.deleteFacility(response.id);
    });

    it("should update facility", async () => {
        const response = await facilityService.addFacility({
            name: "Test facility",
        });

        expect(response).not.toBeFalsy();

        if (response) {
            const updated = await facilityService.updateFacility({
                id: response.id,
                name: "Updated facility",
            });

            if (updated) expect(updated.name).toBe("Updated facility");
            else throw new Error("Updated facility is falsy");
        } else {
            throw new Error("Response is falsy");
        }

        if (response) await facilityService.deleteFacility(response.id);
    });

    it("should delete facility", async () => {
        const response = await facilityService.addFacility({
            name: "Test facility",
        });

        expect(response).not.toBeFalsy();

        if (response) {
            const deleted = await facilityService.deleteFacility(response.id);

            if (deleted) expect(deleted.deletedId).toBe(response.id);
            else throw new Error("Deleted facility is falsy");

            const found = await facilityService.getFacilityById(response.id);
            expect(found).toBeFalsy();
        } else {
            throw new Error("Response is falsy");
        }
    });
    it("should fetching all facilities", async () => {
        await facilityService.addFacility({
            name: "Test facility",
        });

        const response = await facilityService.getAllFacilities();
        expect(response.length).toBeGreaterThan(0);
    });
});
