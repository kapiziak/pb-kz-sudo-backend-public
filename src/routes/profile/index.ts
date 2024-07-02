import { Request, Response, Router } from "express";
import {
    PERMISSION_PROFILE_OBJECTS_READ,
    PERMISSION_PROFILE_SELF_READ,
    PERMISSION_PROFILE_SELF_WRITE,
} from "../../../config/permissions-scopes";
import middlewares from "../../app/middlewares";
import { profileService } from "../../services/profileService";
import TApiError from "../../types/api/errors/api-errors";
import {
    TCreateProfileResponse,
    TDeleteProfileResponse,
    TGetProfileResponse,
    TUpdateProfileResponse,
    profileErrors,
} from "../../types/api/profile/profile-responses";
import {
    prepareApiErrorResponse,
    prepareApiJsonResponse,
} from "../../utils/api";
import { avatarRouter } from "./avatar";

export const profileRouter = Router();

profileRouter.use("/avatar", avatarRouter);

profileRouter.get(
    "/",
    [
        middlewares.authMiddleware,
        middlewares.permissionsMiddleware([PERMISSION_PROFILE_SELF_READ]),
    ],
    async (req: Request, res: Response) => {
        const profile = await profileService.getUserProfile(req.user!!.id);

        /* #swagger.responses[200] = {
            description: 'User profile',
            schema: {
                $status: "success",
                $serverTime: '1',
                $data: {
                    $profile: {
                        $ref: "#/definitions/Profile"
                    }
                }
            }
        } */

        return res.status(200).json(
            prepareApiJsonResponse<TGetProfileResponse>({
                profile,
            })
        );
    }
);

profileRouter.post(
    "/",
    [
        middlewares.authMiddleware,
        middlewares.permissionsMiddleware([PERMISSION_PROFILE_SELF_WRITE]),
    ],
    async (req: Request, res: Response) => {
        const {
            firstName,
            surname,
            description,
        }: { firstName: string; surname?: string; description?: string } =
            req.body;

        if (!firstName) {
            return res
                .status(400)
                .json(
                    prepareApiErrorResponse<TApiError>(
                        profileErrors.payloadError
                    )
                );
        }

        let profile;

        try {
            profile = await profileService.createUserProfile(req.user!!.id, {
                firstName,
                surname: surname ?? null,
                description: description ?? null,
                avatarUrl: null,
            });
        } catch (e) {
            return res
                .status(400)
                .json(
                    prepareApiErrorResponse<TApiError>(
                        profileErrors.createDbError
                    )
                );
        }

        if (!profile) {
            return res
                .status(400)
                .json(
                    prepareApiErrorResponse<TApiError>(
                        profileErrors.createDbError
                    )
                );
        }

        /* #swagger.responses[200] = {
        description: 'Created user profile',
        schema: {
            $status: "success",
            $serverTime: '1',
            $data: {
                $profile: {
                    $ref: "#/definitions/Profile"
                }
            }
        }
    } */

        return res.status(200).json(
            prepareApiJsonResponse<TCreateProfileResponse>({
                profile,
            })
        );
    }
);

profileRouter.put(
    "/",
    [
        middlewares.authMiddleware,
        middlewares.permissionsMiddleware([PERMISSION_PROFILE_SELF_WRITE]),
    ],
    async (req: Request, res: Response) => {
        const {
            firstName,
            surname,
            description,
        }: { firstName?: string; surname?: string; description?: string } =
            req.body;

        let profile;

        try {
            profile = await profileService.updateUserProfile(req.user!!.id, {
                firstName,
                surname,
                description,
            });
        } catch (e) {
            return res
                .status(400)
                .json(
                    prepareApiErrorResponse<TApiError>(
                        profileErrors.updateDbError
                    )
                );
        }

        if (!profile) {
            return res
                .status(400)
                .json(
                    prepareApiErrorResponse<TApiError>(
                        profileErrors.updateDbError
                    )
                );
        }

        /* #swagger.responses[200] = {
        description: 'Updated user profile',
        schema: {
            $status: "success",
            $serverTime: '1',
            $data: {
                $profile: {
                    $ref: "#/definitions/Profile"
                }
            }
        }
    } */

        return res.status(200).json(
            prepareApiJsonResponse<TUpdateProfileResponse>({
                profile,
            })
        );
    }
);

profileRouter.delete(
    "/",
    [
        middlewares.authMiddleware,
        middlewares.permissionsMiddleware([PERMISSION_PROFILE_SELF_WRITE]),
    ],
    async (req: Request, res: Response) => {
        let deletedResult;
        try {
            deletedResult = await profileService.deleteUserProfile(
                req.user!!.id
            );
        } catch (e) {
            return res
                .status(400)
                .json(
                    prepareApiErrorResponse<TApiError>(
                        profileErrors.deleteDbError
                    )
                );
        }

        if (!deletedResult)
            return res
                .status(400)
                .json(
                    prepareApiErrorResponse<TApiError>(
                        profileErrors.deleteDbError
                    )
                );

        /* #swagger.responses[200] = {
            description: 'Deleted user profile',
            schema: {
                $status: "success",
                $serverTime: '1',
                $data: {
                    $deletedId: "1"
                }
            }
        } */

        return res.status(200).json(
            prepareApiJsonResponse<TDeleteProfileResponse>({
                deletedId: deletedResult.deletedId,
            })
        );
    }
);

profileRouter.get(
    "/:userId",
    [
        middlewares.authMiddleware,
        middlewares.permissionsMiddleware([PERMISSION_PROFILE_OBJECTS_READ]),
    ],
    async (req: Request, res: Response) => {
        const { userId } = req.params;

        if (!userId) {
            return res
                .status(400)
                .json(
                    prepareApiErrorResponse<TApiError>(
                        profileErrors.payloadError
                    )
                );
        }

        const profile = await profileService.getUserProfile(parseInt(userId));

        /* #swagger.responses[200] = {
            description: 'User profile',
            schema: {
                $status: "success",
                $serverTime: '1',
                $data: {
                    $profile: {
                        $ref: "#/definitions/Profile"
                    }
                }
            }
        } */

        return res
            .status(200)
            .json(prepareApiJsonResponse<TGetProfileResponse>({ profile }));
    }
);
