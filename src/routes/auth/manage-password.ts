import { Request, Response, Router } from "express";
import { PERMISSION_USERS_PASSWORD_SELF_WRITE } from "../../../config/permissions-scopes";
import middlewares from "../../app/middlewares";
import userService from "../../services/userService";
import {
    TChangePasswordResponse,
    authErrors,
} from "../../types/api/auth/auth-responses";
import {
    prepareApiErrorResponse,
    prepareApiJsonResponse,
} from "../../utils/api";

export const passwordRouter = Router();

passwordRouter.post(
    "/change",
    [
        middlewares.authMiddleware,
        middlewares.permissionsMiddleware([
            PERMISSION_USERS_PASSWORD_SELF_WRITE,
        ]),
    ],
    async (req: Request, res: Response) => {
        const { newPassword }: { newPassword: string } = req.body;

        if (!newPassword) {
            return res
                .status(400)
                .json(prepareApiErrorResponse(authErrors.payloadError));
        }

        let result;
        try {
            result = await userService.changePassword(
                req.user!!.id,
                newPassword
            );
        } catch (e) {
            return res
                .status(400)
                .json(
                    prepareApiErrorResponse(authErrors.changePasswordFailure)
                );
        }

        if (!result) {
            return res
                .status(400)
                .json(
                    prepareApiErrorResponse(authErrors.changePasswordFailure)
                );
        }

        /* #swagger.responses[200] = {
            description: 'Password changed',
            schema: {
                $status: "success",
                $serverTime: '1',
                $data: {
                    $affectedUserId: "1",
                    $result: true,
                }
            }
        } */

        return prepareApiJsonResponse<TChangePasswordResponse>({
            affectedUserId: req.user!!.id,
            result,
        });
    }
);
