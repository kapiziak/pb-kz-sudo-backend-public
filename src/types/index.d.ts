import { User as UserPrisma } from "@prisma/client";

declare global {
    namespace Express {
        interface User
            extends Pick<UserPrisma, "id" | "email" | "profile" | "role"> {}
    }
}
export {};
