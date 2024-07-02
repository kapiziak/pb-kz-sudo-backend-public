import { Request, Response, Router } from "express";
import { PERMISSION_AUTHORIZATIONS_SELF_READ } from "../../../config/permissions-scopes";
import middlewares from "../../app/middlewares";
import authorizationService from "../../services/authorizationService";
import {
    TAddNewAuthorizationResponse,
    TDeleteAuthorizationResponse,
    TGetAllAuthorizationsResponse,
    TGetAuthorizationResponse,
    TUpdateAuthorizationResponse,
    authorizationsErrors,
} from "../../types/api/authorizations/authorizations-responses";
import TApiError from "../../types/api/errors/api-errors";
import {
    prepareApiErrorResponse,
    prepareApiJsonResponse,
} from "../../utils/api";
import { parseTimestampToDate } from "../../utils/date-validator";

export const authorizationsRouter = Router();

authorizationsRouter.get(
    "/",
    [
        middlewares.authMiddleware,
        middlewares.permissionsMiddleware(["authorizations.objects:read"]),
    ],
    async (req: Request, res: Response) => {
        const authorizations =
            await authorizationService.getAllAuthorizations();

        /*
       #swagger.responses[200] = {
             description: 'List of all authorizations',
             schema: {
                 $status: "success",
                 $serverTime: '1',
                 $data: {
                   $authorizations: [
                    { $ref: "#/definitions/Authorization" }
                   ]
                 },
               }
        } */

        return res.json(
            prepareApiJsonResponse<TGetAllAuthorizationsResponse>({
                authorizations,
            })
        );
    }
);

authorizationsRouter.get(
    "/my-authorizations",
    [
        middlewares.authMiddleware,
        middlewares.permissionsMiddleware([
            PERMISSION_AUTHORIZATIONS_SELF_READ,
        ]),
    ],
    async (req: Request, res: Response) => {
        const authorizations = await authorizationService.getUserAuthorizations(
            req.user!!.id
        );

        /*
       #swagger.responses[200] = {
             description: 'List of user authorizations',
             schema: {
                 $status: "success",
                 $serverTime: '1',
                 $data: {
                   $authorizations: [
                    { $ref: "#/definitions/Authorization" }
                   ]
                 },
               }
        } */

        return res.json(
            prepareApiJsonResponse<TGetAllAuthorizationsResponse>({
                authorizations,
            })
        );
    }
);

authorizationsRouter.post(
    "/",
    [
        middlewares.authMiddleware,
        middlewares.permissionsMiddleware(["authorizations.objects:write"]),
    ],
    async (req: Request, res: Response) => {
        const {
            expireAt,
            assignedUsers,
            scopeFacility,
        }: {
            expireAt: string;
            assignedUsers: number[];
            scopeFacility: number[];
        } = req.body;

        if (
            typeof expireAt !== "string" ||
            typeof assignedUsers !== "object" ||
            typeof scopeFacility !== "object"
        ) {
            res.status(400);
            return res.json(
                prepareApiErrorResponse<TApiError>(
                    authorizationsErrors.addPayloadError
                )
            );
        }

        const parsedDate = parseTimestampToDate(expireAt);

        if (!parsedDate) {
            res.status(400);
            return res.json(
                prepareApiErrorResponse<TApiError>(
                    authorizationsErrors.parseExpireAtError
                )
            );
        }

        let authorization;
        try {
            authorization = await authorizationService.addAuthorization({
                createdByUserId: req.user!!.id,
                expireAt: parsedDate,
                scopeFacility,
                assignedUsers,
            });
        } catch (e) {
            console.error(e);
            res.status(400);
            return res.json(
                prepareApiErrorResponse<TApiError>(
                    authorizationsErrors.addDbError
                )
            );
        }

        if (!authorization) {
            res.status(400);
            return res.json(
                prepareApiErrorResponse<TApiError>(
                    authorizationsErrors.addDbError
                )
            );
        }

        /*
       #swagger.responses[200] = {
             description: 'Authorization added.',
             schema: {
                 $status: "success",
                 $serverTime: '1',
                 $data: {
                    authorization: { $ref: "#/definitions/Authorization" }
                 },
               }
        } */

        return res.json(
            prepareApiJsonResponse<TAddNewAuthorizationResponse>({
                authorization,
            })
        );
    }
);

authorizationsRouter.get(
    "/:authorizationId",
    [
        middlewares.authMiddleware,
        middlewares.permissionsMiddleware(["authorizations.objects:read"]),
    ],
    async (req: Request, res: Response) => {
        const { authorizationId } = req.params;

        const id = parseInt(authorizationId);
        if (id < 1) {
            res.status(400);
            return res.json(
                prepareApiErrorResponse<TApiError>(
                    authorizationsErrors.getPayloadError
                )
            );
        }

        let authorization;

        try {
            authorization = await authorizationService.getAuthorizationById(id);
        } catch (e) {
            res.status(400);
            return res.json(
                prepareApiErrorResponse<TApiError>(
                    authorizationsErrors.getDbError
                )
            );
        }

        if (!authorization) {
            res.status(400);
            return res.json(
                prepareApiErrorResponse<TApiError>(
                    authorizationsErrors.getNotFound
                )
            );
        }

        /*
           #swagger.responses[200] = {
             description: 'Single authorization.',
             schema: {
                 $status: "success",
                 $serverTime: '1',
                 $data: {
                    authorization: { $ref: "#/definitions/Authorization" }
                 },
               }
        } */

        return res.json(
            prepareApiJsonResponse<TGetAuthorizationResponse>({
                authorization,
            })
        );
    }
);

authorizationsRouter.put(
    "/:authorizationId",
    [
        middlewares.authMiddleware,
        middlewares.permissionsMiddleware(["authorizations.objects:write"]),
    ],
    async (req: Request, res: Response) => {
        const {
            expireAt,
            assignedUsers,
            scopeFacility,
        }: {
            expireAt: string;
            assignedUsers: number[];
            scopeFacility: number[];
        } = req.body;

        const { authorizationId } = req.params;

        const id = parseInt(authorizationId);

        if (id < 1) {
            res.status(400);
            return res.json(
                prepareApiErrorResponse<TApiError>(
                    authorizationsErrors.updatePayloadError
                )
            );
        }

        if (
            (typeof expireAt !== "undefined" && typeof expireAt !== "string") ||
            (typeof assignedUsers !== "undefined" &&
                typeof assignedUsers !== "object") ||
            (typeof scopeFacility !== "undefined" &&
                typeof scopeFacility !== "object")
        ) {
            res.status(400);
            return res.json(
                prepareApiErrorResponse<TApiError>(
                    authorizationsErrors.updatePayloadError
                )
            );
        }

        const parsedDate = expireAt ? parseTimestampToDate(expireAt) : null;

        if (parsedDate === false) {
            res.status(400);
            return res.json(
                prepareApiErrorResponse<TApiError>(
                    authorizationsErrors.parseExpireAtError
                )
            );
        }

        let authorization;

        try {
            authorization = await authorizationService.updateAuthorization({
                id,
                assignedUsers,
                scopeFacility,
                expireAt: parsedDate ?? undefined,
            });
        } catch (e) {
            res.status(400);
            return res.json(
                prepareApiErrorResponse<TApiError>(
                    authorizationsErrors.updateDbError
                )
            );
        }

        if (!authorization) {
            res.status(400);
            return res.json(
                prepareApiErrorResponse<TApiError>(
                    authorizationsErrors.updateDbError
                )
            );
        }

        /*
       #swagger.responses[200] = {
             description: 'Authorization updated',
             schema: {
                 $status: "success",
                 $serverTime: '1',
                 $data: {
                    authorization: { $ref: "#/definitions/Authorization" }
                 },
               }
        } */

        return res.json(
            prepareApiJsonResponse<TUpdateAuthorizationResponse>({
                authorization,
            })
        );
    }
);

authorizationsRouter.delete(
    "/:authorizationId",
    [
        middlewares.authMiddleware,
        middlewares.permissionsMiddleware(["authorizations.objects:write"]),
    ],
    async (req: Request, res: Response) => {
        const { authorizationId } = req.params;

        const id = parseInt(authorizationId);
        if (id < 1) {
            res.status(400);
            return res.json(
                prepareApiErrorResponse<TApiError>(
                    authorizationsErrors.deletePayloadError
                )
            );
        }

        let result;

        try {
            result = await authorizationService.deleteAuthorization(id);
        } catch (e) {
            res.status(400);
            return res.json(
                prepareApiErrorResponse<TApiError>(
                    authorizationsErrors.deleteDbError
                )
            );
        }

        if (!result) {
            res.status(400);
            return res.json(
                prepareApiErrorResponse<TApiError>(
                    authorizationsErrors.deleteDbError
                )
            );
        }

        /*
           #swagger.responses[200] = {
             description: 'Authorization removed.',
             schema: {
                 $status: "success",
                 $serverTime: '1',
                 $data: {
                    deletedId: "1"
                 },
               }
        } */

        return res.json(
            prepareApiJsonResponse<TDeleteAuthorizationResponse>({
                deletedId: result.deletedId,
            })
        );
    }
);
