import { Role } from "@prisma/client";
import { TScope } from "../../types/permissions/scope";
import permissionsPerRole from "../../../config/permissions-per-role";

export const isRolePrivilaged = (role: Role, scopes: TScope[]) => {
    return (
        permissionsPerRole[role].at(0) === "*" ||
        scopes.every((scope) => permissionsPerRole[role]?.includes(scope))
    );
};
