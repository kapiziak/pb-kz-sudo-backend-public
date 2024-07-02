import { entryService } from "../../../src/services/entryService";
import { usePrepareTestFacility } from "../../helpers/prepare-test-facility";
import { usePrepareTestUser } from "../../helpers/prepare-test-user";

describe("Test entry service methods", () => {
    const userPromise1 = usePrepareTestUser({
        login: "foo@bar.com",
        password: "nyancat",
    });

    const userPromise2 = usePrepareTestUser({
        login: "foo2@bar.com",
        password: "nyancat",
    });

    const facilityPromise1 = usePrepareTestFacility({
        name: "Room 1",
    });

    const facilityPromise2 = usePrepareTestFacility({
        name: "Room 2",
    });

    afterAll(async () => {
        await entryService.deleteOccupancy({
            type: "by-facility-id",
            facilityId: 1,
        });

        await entryService.deleteOccupancy({
            type: "by-facility-id",
            facilityId: 2,
        });
    });

    it("should return all entries", async () => {
        const entries = await entryService.getAllEntries();
        expect(entries.length).toBe(0);

        const newEntry = await entryService.addEntry(
            await Promise.all([facilityPromise1, facilityPromise2]),
            new Date(),
            await userPromise1,
            await userPromise2
        );

        expect(newEntry).not.toBeFalsy();

        if (newEntry.ok) {
            const found = await entryService.getEntryById(newEntry.entry.id);
            expect(found?.id).toBe(newEntry.entry.id);
        } else {
            throw new Error("Response is falsy");
        }

        const entries2 = await entryService.getAllEntries();
        expect(entries2.length).toBe(1);

        if (newEntry) {
            await entryService.releaseEntry(newEntry.entry.id);
            await entryService.deleteEntry(newEntry.entry.id);
        }
    });

    it("should add entry", async () => {
        const newEntry = await entryService.addEntry(
            await Promise.all([facilityPromise1, facilityPromise2]),
            new Date(),
            await userPromise1,
            await userPromise2
        );

        expect(newEntry).not.toBeFalsy();

        if (newEntry.ok) {
            const found = await entryService.getEntryById(newEntry.entry.id);
            expect(found?.id).toBe(newEntry.entry.id);
        } else {
            throw new Error("Response is falsy");
        }

        if (newEntry) {
            await entryService.releaseEntry(newEntry.entry.id);
            await entryService.deleteEntry(newEntry.entry.id);
        }
    });

    it("should remove entry", async () => {
        const listBefore = await entryService.getAllEntries();

        const newEntry = await entryService.addEntry(
            await Promise.all([facilityPromise1, facilityPromise2]),
            new Date(),
            await userPromise1,
            await userPromise2
        );
        expect(newEntry).not.toBeFalsy();

        const list = await entryService.getAllEntries();
        expect(list.length).toBe(listBefore.length + 1);

        if (newEntry.ok) {
            await entryService.releaseEntry(newEntry.entry.id);
            await entryService.deleteEntry(newEntry.entry.id);
        }

        const listAfter = await entryService.getAllEntries();
        expect(listAfter.length).toBe(listBefore.length);
    });

    it("should remove entry without releasing it before", async () => {
        const listBefore = await entryService.getAllEntries();
        const newEntry = await entryService.addEntry(
            await Promise.all([facilityPromise1, facilityPromise2]),
            new Date(),
            await userPromise1,
            await userPromise2
        );

        expect(newEntry).not.toBeFalsy();

        if (!newEntry.ok) throw new Error("Response is falsy");
        const deleteResult = await entryService.deleteEntry(newEntry.entry.id);

        expect(deleteResult).not.toBeFalsy();

        const newEntry2 = await entryService.addEntry(
            await Promise.all([facilityPromise1, facilityPromise2]),
            new Date(),
            await userPromise1,
            await userPromise2
        );
        expect(newEntry2).not.toBeFalsy();

        if (!newEntry2.ok) throw new Error("Response is falsy");
        const deleteResult2 = await entryService.deleteEntry(
            newEntry2.entry.id
        );

        expect(deleteResult2).not.toBeFalsy();
    });

    it("should allow to add entry when facility is not occupied", async () => {
        const newEntry = await entryService.addEntry(
            await Promise.all([facilityPromise1, facilityPromise2]),
            new Date(),
            await userPromise1,
            await userPromise2
        );

        expect(newEntry).not.toBeFalsy();

        if (newEntry.ok === true) {
            const found = await entryService.getEntryById(newEntry.entry.id);
            expect(found?.id).toBe(newEntry.entry.id);
        } else {
            throw new Error("Response is falsy");
        }

        await entryService.releaseEntry(newEntry.entry.id);

        const newEntry2 = await entryService.addEntry(
            await Promise.all([facilityPromise1, facilityPromise2]),
            new Date(),
            await userPromise1,
            await userPromise2
        );

        expect(newEntry.ok).toBe(true);

        if (newEntry2.ok === true && newEntry.ok === true) {
            await entryService.releaseEntry(newEntry2.entry.id);
            await entryService.deleteEntry(newEntry.entry.id);
            await entryService.deleteEntry(newEntry2.entry.id);
        }
    });
});
