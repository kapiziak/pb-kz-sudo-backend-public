import { Role } from "@prisma/client";

export type TPermissionsPerRole = Record<
    Role,
    (`${string}.${string}:${"read" | "write"}` | `${string}.*` | "*")[]
>;
