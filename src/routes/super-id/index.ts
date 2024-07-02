import { Request, Response, Router } from "express";
import {
    PERMISSION_SUPER_ID_SELF_REVOKE_WRITE,
    PERMISSION_SUPER_ID_SELF_UPDATE_WRITE,
    PERMISSION_SUPER_ID_USE_SECRET_WRITE,
} from "../../../config/permissions-scopes";
import middlewares from "../../app/middlewares";
import { challengeService } from "../../services/challengeService";
import { superIdService } from "../../services/superIdService";
import TApiError from "../../types/api/errors/api-errors";
import {
    TCreateSuperIdResponse,
    TGetSuperIdResponse,
    TRevokeSuperIdResponse,
    TUseSecretSuperIdResponse,
    superIdErrors,
} from "../../types/api/superId/superId-responses";
import {
    prepareApiErrorResponse,
    prepareApiJsonResponse,
} from "../../utils/api";
import { parseTimestampToDate } from "../../utils/date-validator";
import { generateSuperIdSecret } from "../../utils/super-id";
import { challengeRouter } from "./challenge";

export const superIdRouter = Router();

superIdRouter.use("/challenge", challengeRouter);

superIdRouter.get(
    "/",
    [middlewares.authMiddleware],
    async (req: Request, res: Response) => {
        const superId = await superIdService.getUserSuperId(req.user!!.id);

        /* #swagger.responses[400] = {
                description: 'User has no superId',
                schema: {
                    $status: 'error',
                    $serverTime: '1',
                    $data: {
                          $code: "GET_SUPER_ID_NOT_FOUND",
                          $message: "SuperId assigned to your account not found",
                    }
                }
             } */

        if (!superId) {
            return res
                .status(400)
                .json(
                    prepareApiErrorResponse<TApiError>(
                        superIdErrors.getNotFound
                    )
                );
        }

        /* #swagger.responses[200] = {
                description: 'Current users superId',
                schema: {
                    $status: "success",
                    $serverTime: '1',
                    $data: {
                        $superId: {
                            $ref: "#/definitions/SuperId"
                        }
                    }
                }
             } */

        return res.status(200).json(
            prepareApiJsonResponse<TGetSuperIdResponse>({
                superId,
            })
        );
    }
);

superIdRouter.post(
    "/",
    [
        middlewares.authMiddleware,
        middlewares.permissionsMiddleware(["superId.self_create:write"]),
    ],
    async (req: Request, res: Response) => {
        /* #swagger.requestBody = {
                required: true,
                content: {
                  "application/json": {
                      schema: {
                      "type": "object",
                         "properties": {
                            validTo: { type: "number" },
                            pin: { type: "string" },
                            studentId: { type: "string" },
                            identityCardId: { type: "string" },
                        }
                      }
                  }
                }
   } */

        const {
            validTo,
            identityCardId,
            pin,
            studentId,
        }: {
            validTo: number;
            pin?: string;
            studentId?: string;
            identityCardId?: string;
        } = req.body;

        if (!validTo || !pin) {
            return res
                .status(400)
                .json(
                    prepareApiErrorResponse<TApiError>(
                        superIdErrors.addPayloadError
                    )
                );
        }

        const parsedValidTo = parseTimestampToDate(validTo);

        if (!parsedValidTo) {
            res.status(400);
            return res.json(
                prepareApiErrorResponse<TApiError>(
                    superIdErrors.validToParseError
                )
            );
        }

        const randomSecret = await generateSuperIdSecret();
        let createdSuperId;

        try {
            createdSuperId = await superIdService.createSuperId(
                req.user!!.id,
                parsedValidTo,
                randomSecret,
                pin,
                studentId,
                identityCardId
            );
        } catch (e) {
            return res
                .status(400)
                .json(
                    prepareApiErrorResponse<TApiError>(superIdErrors.addDbError)
                );
        }

        if (!createdSuperId) {
            return res
                .status(400)
                .json(
                    prepareApiErrorResponse<TApiError>(superIdErrors.addDbError)
                );
        }

        /* #swagger.responses[200] = {
                description: 'Created superId',
                schema: {
                    $status: "success",
                    $serverTime: '1',
                    $data: {
                        $superId: {
                            $ref: "#/definitions/SuperId"
                        }
                    }
                }
             } */

        return res.status(200).json(
            prepareApiJsonResponse<TCreateSuperIdResponse>({
                superId: createdSuperId,
            })
        );
    }
);

superIdRouter.put(
    "/",
    [
        middlewares.authMiddleware,
        middlewares.permissionsMiddleware([
            PERMISSION_SUPER_ID_SELF_UPDATE_WRITE,
        ]),
    ],
    async (req: Request, res: Response) => {
        const {
            identityCardId,
            pin,
            studentId,
        }: {
            pin?: string;
            studentId?: string;
            identityCardId?: string;
        } = req.body;

        const randomSecret = await generateSuperIdSecret();

        let updatedObject;
        try {
            updatedObject = await superIdService.updateSuperId({
                userId: req.user!!.id,
                newSecret: randomSecret,
                pin,
                studentId,
                identityCardId,
            });
        } catch (e) {
            return res
                .status(400)
                .json(
                    prepareApiErrorResponse<TApiError>(
                        superIdErrors.updateDbError
                    )
                );
        }

        if (!updatedObject) {
            return res
                .status(400)
                .json(
                    prepareApiErrorResponse<TApiError>(
                        superIdErrors.updateDbError
                    )
                );
        }

        /* #swagger.responses[200] = {
                description: 'Updated superId',
                schema: {
                    $status: "success",
                    $serverTime: '1',
                    $data: {
                        $superId: {
                            $ref: "#/definitions/SuperId"
                        }
                    }
                }
             } */

        return res.status(200).json(
            prepareApiJsonResponse<TCreateSuperIdResponse>({
                superId: updatedObject,
            })
        );
    }
);

superIdRouter.post(
    "/revoke",
    [
        middlewares.authMiddleware,
        middlewares.permissionsMiddleware([
            PERMISSION_SUPER_ID_SELF_REVOKE_WRITE,
        ]),
    ],
    async (req: Request, res: Response) => {
        let deleteResult;
        try {
            deleteResult = await superIdService.deleteSuperId(req.user!!.id);
        } catch (e) {
            return res
                .status(400)
                .json(
                    prepareApiErrorResponse<TApiError>(
                        superIdErrors.deleteDbError
                    )
                );
        }

        if (!deleteResult) {
            return res
                .status(400)
                .json(
                    prepareApiErrorResponse<TApiError>(
                        superIdErrors.deleteDbError
                    )
                );
        }

        /* #swagger.responses[200] = {
                description: 'Revoked superId',
                schema: {
                    $status: "success",
                    $serverTime: '1',
                    $data: {
                        $revokedId: 1
                    }
                }
             } */

        return res.status(200).json(
            prepareApiJsonResponse<TRevokeSuperIdResponse>({
                revokedId: deleteResult.deletedId,
            })
        );
    }
);

superIdRouter.post(
    "/useSecret",
    [
        middlewares.authMiddleware,
        middlewares.permissionsMiddleware([
            PERMISSION_SUPER_ID_USE_SECRET_WRITE,
        ]),
    ],
    async (req: Request, res: Response) => {
        const { secret }: { secret: string } = req.body;

        if (!secret) {
            return res
                .status(400)
                .json(
                    prepareApiErrorResponse<TApiError>(
                        superIdErrors.useSecretPayloadError
                    )
                );
        }

        const superId = await superIdService.getSuperIdBySecret(secret);

        if (!superId) {
            return res
                .status(400)
                .json(
                    prepareApiErrorResponse<TApiError>(
                        superIdErrors.useSecretNotFound
                    )
                );
        }

        const challenge = await challengeService.createChallenge(superId.id);

        if (!challenge) {
            return res
                .status(400)
                .json(
                    prepareApiErrorResponse<TApiError>(
                        superIdErrors.useSecretNotFound
                    )
                );
        }

        /*
         #swagger.responses[200] = {
             description: 'Challenge created',
             schema: {
                 $status: "success",
                 $serverTime: '1',
                 $data: {
                   $challengeId: "uuidv4",
                   $identityCardId: "AAABBBCCC",
                   $studentId: "AAABBBCCC",
                   $userId: 1,
                 },
               }
        } */

        return res.status(200).json(
            prepareApiJsonResponse<TUseSecretSuperIdResponse>({
                challengeId: challenge.challengeId,
                identityCardId: superId.identityCardId,
                studentId: superId.studentId,
                userId: superId.userId,
            })
        );
    }
);
