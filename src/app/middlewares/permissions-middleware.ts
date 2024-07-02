import { NextFunction, Request, Response } from "express";
import { prepareApiErrorResponse } from "../../utils/api";
import TApiError from "../../types/api/errors/api-errors";
import { isRolePrivilaged } from "../permissions/permissions-helpers";
import { TScope } from "../../types/permissions/scope";

const permissionsMiddleware =
    (scope: TScope[]) => (req: Request, res: Response, next: NextFunction) => {
        const userRole = req.user?.role;

        if (!userRole) {
            return res.status(403).json(
                prepareApiErrorResponse<TApiError>({
                    code: "PERMISSIONS_ERROR",
                    message:
                        "You don't have permission to access this resource",
                })
            );
        }

        const hasPermission = isRolePrivilaged(userRole, scope);

        if (!hasPermission) {
            return res.status(403).json(
                prepareApiErrorResponse<TApiError>({
                    code: "PERMISSIONS_ERROR",
                    message:
                        "You don't have permission to access this resource",
                })
            );
        }
        return next();
    };

export default permissionsMiddleware;
