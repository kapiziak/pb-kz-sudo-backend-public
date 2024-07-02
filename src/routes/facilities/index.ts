import { Request, Response, Router } from "express";
import {
    PERMISSION_ENTRY_RELEASE_WRITE,
    PERMISSION_FACILITIES_OCCUPANCY_READ,
} from "../../../config/permissions-scopes";
import middlewares from "../../app/middlewares";
import facilityService from "../../services/facilityService";
import TApiError from "../../types/api/errors/api-errors";
import {
    TAddNewFacilityResponse,
    TCheckFacilityOccupiedResponse,
    TDeleteFacilityResponse,
    TGetAllFacilitiesResponse,
    TGetFacilityResponse,
    TReleaseFacilityOccupancyResponse,
    TUpdateFacilityResponse,
    facilitiesErrors,
} from "../../types/api/facilities/facilities-responses";
import {
    prepareApiErrorResponse,
    prepareApiJsonResponse,
} from "../../utils/api";

export const facilitiesRouter = Router();

facilitiesRouter.get(
    "/",
    [
        middlewares.authMiddleware,
        middlewares.permissionsMiddleware(["facilities.objects:read"]),
    ],
    async (req: Request, res: Response) => {
        const facilities = await facilityService.getAllFacilities();

        /*
       #swagger.responses[200] = {
             description: 'List of all facilities',
             schema: {
                 $status: "success",
                 $serverTime: '1',
                 $data: {
                   $facilities: [{
                        $ref: "#/definitions/Facility"
                   }]
                 },
               }
        } */

        return res.json(
            prepareApiJsonResponse<TGetAllFacilitiesResponse>({
                facilities,
            })
        );
    }
);

facilitiesRouter.post(
    "/",
    [
        middlewares.authMiddleware,
        middlewares.permissionsMiddleware(["facilities.objects:write"]),
    ],
    async (req: Request, res: Response) => {
        const { name }: { name: string } = req.body;

        let facility;
        try {
            facility = await facilityService.addFacility({
                name,
            });
        } catch (e) {
            res.status(400);
            return res.json(
                prepareApiErrorResponse<TApiError>(facilitiesErrors.addDbError)
            );
        }

        if (!facility) {
            res.status(400);
            return res.json(
                prepareApiErrorResponse<TApiError>(facilitiesErrors.addDbError)
            );
        }

        /*
       #swagger.responses[200] = {
             description: 'Facility successfully added',
             schema: {
                 $status: "success",
                 $serverTime: '1',
                 $data: {
                   $facility: {
                        $ref: "#/definitions/Facility"
                   }
                 },
               }
        } */

        return res.json(
            prepareApiJsonResponse<TAddNewFacilityResponse>({
                facility,
            })
        );
    }
);

facilitiesRouter.get(
    "/:facilityId",
    [
        middlewares.authMiddleware,
        middlewares.permissionsMiddleware(["facilities.objects:read"]),
    ],
    async (req: Request, res: Response) => {
        const { facilityId } = req.params;

        const id = parseInt(facilityId);
        if (id < 1) {
            res.status(400);
            return res.json(
                prepareApiErrorResponse<TApiError>(
                    facilitiesErrors.getPayloadError
                )
            );
        }

        let facility;

        try {
            facility = await facilityService.getFacilityById(id);
        } catch (e) {
            res.status(400);
            return res.json(
                prepareApiErrorResponse<TApiError>(facilitiesErrors.getDbError)
            );
        }

        if (!facility) {
            res.status(400);
            return res.json(
                prepareApiErrorResponse<TApiError>(facilitiesErrors.getNotFound)
            );
        }

        /*
         #swagger.responses[200] = {
             description: 'Single facility',
             schema: {
                 $status: "success",
                 $serverTime: '1',
                 $data: {
                   $facility: {
                        $ref: "#/definitions/Facility"
                   }
                 },
               }
        } */

        return res.json(
            prepareApiJsonResponse<TGetFacilityResponse>({
                facility,
            })
        );
    }
);

facilitiesRouter.put(
    "/:facilityId",
    [
        middlewares.authMiddleware,
        middlewares.permissionsMiddleware(["facilities.objects:write"]),
    ],
    async (req: Request, res: Response) => {
        const { name }: { name: string } = req.body;
        const { facilityId } = req.params;

        const id = parseInt(facilityId);

        if (id < 1 || !name) {
            res.status(400);
            return res.json(
                prepareApiErrorResponse<TApiError>(
                    facilitiesErrors.updatePayloadError
                )
            );
        }

        let facility;

        try {
            facility = await facilityService.updateFacility({
                id: parseInt(facilityId),
                name,
            });
        } catch (e) {
            res.status(400);
            return res.json(
                prepareApiErrorResponse<TApiError>(
                    facilitiesErrors.updateDbError
                )
            );
        }

        if (!facility) {
            res.status(400);
            return res.json(
                prepareApiErrorResponse<TApiError>(
                    facilitiesErrors.updateDbError
                )
            );
        }

        /*
         #swagger.responses[200] = {
             description: 'Facility updated.',
             schema: {
                 $status: "success",
                 $serverTime: '1',
                 $data: {
                   $facility: {
                        $ref: "#/definitions/Facility"
                   }
                 },
               }
        } */

        return res.json(
            prepareApiJsonResponse<TUpdateFacilityResponse>({
                facility,
            })
        );
    }
);

facilitiesRouter.delete(
    "/:facilityId",
    [
        middlewares.authMiddleware,
        middlewares.permissionsMiddleware(["facilities.objects:write"]),
    ],
    async (req: Request, res: Response) => {
        const { facilityId } = req.params;

        const id = parseInt(facilityId);
        if (id < 1) {
            res.status(400);
            return res.json(
                prepareApiErrorResponse<TApiError>(
                    facilitiesErrors.deletePayloadError
                )
            );
        }

        let result;

        try {
            result = await facilityService.deleteFacility(id);
        } catch (e) {
            res.status(400);
            return res.json(
                prepareApiErrorResponse<TApiError>(
                    facilitiesErrors.deleteDbError
                )
            );
        }

        if (!result) {
            res.status(400);
            return res.json(
                prepareApiErrorResponse<TApiError>(
                    facilitiesErrors.deleteDbError
                )
            );
        }

        /*
         #swagger.responses[200] = {
             description: 'Facility removed',
             schema: {
                 $status: "success",
                 $serverTime: '1',
                 $data: {
                   $deletedId: "1"
                 },
               }
        } */

        return res.json(
            prepareApiJsonResponse<TDeleteFacilityResponse>({
                deletedId: result.deletedId,
            })
        );
    }
);

facilitiesRouter.get(
    "/:facilityId/occupancies",
    [
        middlewares.authMiddleware,
        middlewares.permissionsMiddleware([
            PERMISSION_FACILITIES_OCCUPANCY_READ,
        ]),
    ],
    async (req: Request, res: Response) => {
        const { facilityId } = req.params;

        const id = parseInt(facilityId);
        if (id < 1) {
            res.status(400);
            return res.json(
                prepareApiErrorResponse<TApiError>(
                    facilitiesErrors.getPayloadError
                )
            );
        }

        let result;

        try {
            result = await facilityService.getFacilityOccupancy(id);
        } catch (e) {
            res.status(400);
            return res.json(
                prepareApiErrorResponse<TApiError>(
                    facilitiesErrors.occupiedDbError
                )
            );
        }

        /*
     #swagger.responses[200] = {
         description: 'Facility occupied status',
         schema: {
             $status: "success",
             $serverTime: '1',
             $data: {
               $isOccupied: "true",
               $occupancies: [{
                    $ref: "#/definitions/FacilityOccupancy"
               }]
             },
           }
    } */

        return res.json(
            prepareApiJsonResponse<TCheckFacilityOccupiedResponse>({
                isOccupied: result !== false && result.length > 0,
                occupancies: result || [],
            })
        );
    }
);

facilitiesRouter.post(
    "/release/:id",
    [
        middlewares.authMiddleware,
        middlewares.permissionsMiddleware([PERMISSION_ENTRY_RELEASE_WRITE]),
    ],
    async (req: Request, res: Response) => {
        const { id } = req.params;

        if (!id) {
            return res
                .status(400)
                .json(
                    prepareApiErrorResponse(facilitiesErrors.getPayloadError)
                );
        }

        let releasedEntry;

        try {
            releasedEntry = await facilityService.releaseFacilityOccupancy(
                parseInt(id)
            );
        } catch (e) {
            return res
                .status(400)
                .json(prepareApiErrorResponse(facilitiesErrors.releaseDbError));
        }

        if (!releasedEntry) {
            return res
                .status(400)
                .json(prepareApiErrorResponse(facilitiesErrors.releaseDbError));
        }

        /*
            #swagger.responses[200] = {
                description: 'Facility released',
                schema: {
                    $status: "success",
                    $serverTime: '1',
                    $data: {
                        $isOccupied: "false"
                    },
                }
            }
        */

        return res.status(200).json(
            prepareApiJsonResponse<TReleaseFacilityOccupancyResponse>({
                isOccupied: false,
            })
        );
    }
);
