import { Role, User } from "@prisma/client";

export type TServiceUser = {
    getAllUsers: () => Promise<Pick<User, "id" | "email" | "role">[]>;
    login: (
        login: string,
        password: string
    ) => Promise<
        | {
              ok: false;
              message: string;
          }
        | {
              ok: true;
              user: Pick<User, "id" | "email" | "role">;
          }
    >;
    register: (
        login: string,
        password: string
    ) => Promise<
        | {
              ok: false;
              message: string;
          }
        | {
              ok: true;
              user: Pick<User, "id" | "email" | "role">;
          }
    >;
    signToken: (userId: number) => string;
    delete: (userId: number) => Promise<boolean>;
    changeRole: (userId: number, role: Role) => Promise<boolean>;
    changePassword: (userId: number, newPassword: string) => Promise<boolean>;
};
