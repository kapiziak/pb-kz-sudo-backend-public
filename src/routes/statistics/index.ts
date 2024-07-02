import { Request, Response, Router } from "express";
import middlewares from "../../app/middlewares";
import { PERMISSION_STATISTICS_ALL_READ } from "../../../config/permissions-scopes";
import authorizationService from "../../services/authorizationService";
import { entryService } from "../../services/entryService";
import facilityService from "../../services/facilityService";
import { prepareApiJsonResponse } from "../../utils/api";
import { TGetAllStatisticsResponse } from "../../types/api/statistics/statistics-responses";

export const statisticsRouter = Router();

statisticsRouter.get(
    "/all",
    [
        middlewares.authMiddleware,
        middlewares.permissionsMiddleware([PERMISSION_STATISTICS_ALL_READ]),
    ],
    async (req: Request, res: Response) => {
        const activeAuthorizations =
            await authorizationService.countAllValidAuthorizations();
        const todayEntries = await entryService.countAllTodayEntries();
        const occupiedFacilities =
            await facilityService.countAllActiveOccupancy();

        /* 
            #swagger.responses[200] = {
                description: 'All statistics',
                schema: {
                 $status: "success",
                 $serverTime: '1',
                 $data: {
                        $activeAuthorizations: 1,
                        $todayEntries: 1,
                        $occupiedFacilities: 1
                 }
               }
            } */

        return res.status(200).json(
            prepareApiJsonResponse<TGetAllStatisticsResponse>({
                activeAuthorizations,
                todayEntries,
                occupiedFacilities,
            })
        );
    }
);
