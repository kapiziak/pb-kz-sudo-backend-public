import { Request, Response, Router } from "express";
import passport from "passport";
import { prepareApiJsonResponse } from "../../utils/api";
import { TGetAllUserResponse } from "../../types/api/users/users-responses";
import userService from "../../services/userService";
import middlewares from "../../app/middlewares";
import { PERMISSION_USERS_OBJECTS_READ } from "../../../config/permissions-scopes";

export const usersRouter = Router();

usersRouter.get(
    "/",
    [
        middlewares.authMiddleware,
        middlewares.permissionsMiddleware([PERMISSION_USERS_OBJECTS_READ]),
    ],
    async (req: Request, res: Response) => {
        const users = await userService.getAllUsers();

        /*
       #swagger.responses[200] = {
             description: 'List of all users',
             schema: {
                 $status: "success",
                 $serverTime: '1',
                 $data: {
                   $users: [{
                     $id: "1",
                     $email: "hello@kzakrzewski.pl",
                     $role: "VISITOR",
                     profile: {},
                   }]
                 },
               }
        } */

        return res.json(
            prepareApiJsonResponse<TGetAllUserResponse>({
                users,
            })
        );
    }
);
