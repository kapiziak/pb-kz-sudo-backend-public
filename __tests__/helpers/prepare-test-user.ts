import { Role } from "@prisma/client";
import userService from "../../src/services/userService";
import { resolve } from "path";

interface Data {
    login: string;
    password: string;
    role?: Role;
}

export const usePrepareTestUser = async ({
    login,
    password,
    role,
}: Data): Promise<number> => {
    return new Promise((resolve, reject) => {
        let userId = -1;

        beforeAll(async () => {
            const registerResponse = await userService.register(
                login,
                password
            );

            expect(registerResponse.ok).toBe(true);

            if (registerResponse.ok) {
                userId = registerResponse.user.id;

                if (role) {
                    const updateRole = await userService.changeRole(
                        userId,
                        role
                    );
                    expect(updateRole).toBe(true);
                }

                resolve(registerResponse.user.id);
            }
        });

        afterAll(async () => {
            expect(await userService.delete(userId));
        });
    });
};
