import { Request, Response, Router } from "express";
import middlewares from "../../app/middlewares";
import {
    PERMISSION_ENTRY_OBJECTS_READ,
    PERMISSION_ENTRY_OBJECTS_WRITE,
    PERMISSION_ENTRY_RELEASE_WRITE,
} from "../../../config/permissions-scopes";
import { entryService } from "../../services/entryService";
import {
    prepareApiErrorResponse,
    prepareApiJsonResponse,
} from "../../utils/api";
import {
    TAddNewEntryResponse,
    TGetAllEntriesResponse,
    TGetEntryResponse,
    TReleaseEntryResponse,
    entryErrors,
} from "../../types/api/entry/entry-responses";

export const entryRouter = Router();

entryRouter.get(
    "/",
    [
        middlewares.authMiddleware,
        middlewares.permissionsMiddleware([PERMISSION_ENTRY_OBJECTS_READ]),
    ],
    async (req: Request, res: Response) => {
        const entries = await entryService.getAllEntries();

        /*
            #swagger.responses[200] = {
                description: 'List of all entries',
                schema: {
                    $status: "success",
                    $serverTime: '1',
                    $data: {
                        $entries: [{
                            $ref: "#/definitions/Entry"
                        }]
                    },
                }
            }
        */

        return res
            .status(200)
            .json(prepareApiJsonResponse<TGetAllEntriesResponse>({ entries }));
    }
);

entryRouter.get(
    "/:id",
    [
        middlewares.authMiddleware,
        middlewares.permissionsMiddleware([PERMISSION_ENTRY_OBJECTS_READ]),
    ],
    async (req: Request, res: Response) => {
        const { id } = req.params;

        if (!id) {
            return res
                .status(400)
                .json(prepareApiErrorResponse(entryErrors.payloadError));
        }

        let entry;

        try {
            entry = await entryService.getEntryById(parseInt(id));
        } catch (e) {
            return res
                .status(400)
                .json(prepareApiErrorResponse(entryErrors.getDbError));
        }

        if (!entry) {
            return res
                .status(400)
                .json(prepareApiErrorResponse(entryErrors.notFound));
        }

        /*
            #swagger.responses[200] = {
                description: 'Entry found',
                schema: {
                    $status: "success",
                    $serverTime: '1',
                    $data: {
                        $entry: {
                            $ref: "#/definitions/Entry"
                        }
                    },
                }
            }
        */

        return res
            .status(200)
            .json(prepareApiJsonResponse<TGetEntryResponse>({ entry }));
    }
);

entryRouter.post(
    "/",
    [
        middlewares.authMiddleware,
        middlewares.permissionsMiddleware([PERMISSION_ENTRY_OBJECTS_WRITE]),
    ],
    async (req: Request, res: Response) => {
        const {
            facilities,
            occupierId,
            authorizationId,
        }: {
            facilities: number[];
            occupierId: number;
            authorizationId: number;
        } = req.body;

        if (!facilities || !occupierId || !authorizationId) {
            return res
                .status(400)
                .json(prepareApiErrorResponse(entryErrors.payloadError));
        }

        let newEntry;

        try {
            newEntry = await entryService.addEntry(
                facilities,
                new Date(),
                req.user!!.id,
                occupierId,
                authorizationId
            );
        } catch (e) {
            console.log(e);
            return res
                .status(400)
                .json(prepareApiErrorResponse(entryErrors.addDbError));
        }

        if (newEntry.ok === false) {
            return res
                .status(400)
                .json(
                    prepareApiErrorResponse(entryErrors.facilityOccupiedError)
                );
        }

        /*
            #swagger.responses[200] = {
                description: 'New entry added',
                schema: {
                    $status: "success",
                    $serverTime: '1',
                    $data: {
                        $entry: {
                            $ref: "#/definitions/Entry"
                        }
                    },
                }
            }
        */

        return res.status(200).json(
            prepareApiJsonResponse<TAddNewEntryResponse>({
                entry: newEntry.entry,
            })
        );
    }
);

entryRouter.post("/release/:id", [
    middlewares.authMiddleware,
    middlewares.permissionsMiddleware([PERMISSION_ENTRY_RELEASE_WRITE]),
    async (req: Request, res: Response) => {
        const { id } = req.params;

        if (!id) {
            return res
                .status(400)
                .json(prepareApiErrorResponse(entryErrors.payloadError));
        }

        let releasedEntry;

        try {
            releasedEntry = await entryService.releaseEntry(parseInt(id));
        } catch (e) {
            return res
                .status(400)
                .json(prepareApiErrorResponse(entryErrors.releaseDbError));
        }

        if (!releasedEntry) {
            return res
                .status(400)
                .json(prepareApiErrorResponse(entryErrors.releaseDbError));
        }

        /*
            #swagger.responses[200] = {
                description: 'Entry released',
                schema: {
                    $status: "success",
                    $serverTime: '1',
                    $data: {
                        $entry: {
                            $ref: "#/definitions/Entry"
                        }
                    },
                }
            }
        */

        return res.status(200).json(
            prepareApiJsonResponse<TReleaseEntryResponse>({
                entry: releasedEntry,
            })
        );
    },
]);
