import facilityService from "../../src/services/facilityService";

interface Data {
    name: string;
}

export const usePrepareTestFacility = ({ name }: Data): Promise<number> => {
    return new Promise((resolve, reject) => {
        let facilityId = -1;

        beforeAll(async () => {
            const res = await facilityService.addFacility({
                name,
            });

            expect(res).not.toBeFalsy();

            if (res) {
                facilityId = res.id;
                resolve(res.id);
            }
        });

        afterAll(async () => {
            expect(await facilityService.deleteFacility(facilityId));
        });
    });
};
