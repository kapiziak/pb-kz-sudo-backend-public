import { Request, Response, Router } from "express";
import middlewares from "../../app/middlewares";
import {
    prepareApiErrorResponse,
    prepareApiJsonResponse,
} from "../../utils/api";
import TApiError from "../../types/api/errors/api-errors";
import {
    TSendChallengeResponse,
    challengeErrors,
} from "../../types/api/superId/challenge-responses";
import { challengeService } from "../../services/challengeService";

export const challengeRouter = Router();

challengeRouter.post(
    "/",
    [
        middlewares.authMiddleware,
        middlewares.permissionsMiddleware(["challenge.solve:write"]),
    ],
    async (req: Request, res: Response) => {
        const { challengeId, pin }: { challengeId: string; pin: string } =
            req.body;

        if (!challengeId || !pin) {
            return res
                .status(400)
                .json(
                    prepareApiErrorResponse<TApiError>(
                        challengeErrors.payloadError
                    )
                );
        }

        let challengeResponse;

        try {
            challengeResponse = await challengeService.sendChallenge(
                challengeId,
                pin
            );
        } catch (e) {
            return res.status(400).json(
                prepareApiErrorResponse<TApiError>({
                    code: challengeErrors.controllerError.code,
                    message:
                        challengeErrors.controllerError.message +
                        (e as Error).message,
                })
            );
        }

        if (!challengeResponse) {
            return res
                .status(400)
                .json(
                    prepareApiErrorResponse<TApiError>(
                        challengeErrors.challengeNotMatching
                    )
                );
        }

        /*
         #swagger.responses[200] = {
             description: 'Challenge response',
             schema: {
                 $status: "success",
                 $serverTime: '1',
                 $data: {
                    $authorizations: [ { $ref: "#/definitions/AuthorizationExtendedFacilities" } ],
                    $user: { 
                        $id: "1",
                        $email: "hello@kzakrzewski.pl",
                        $role: "VISITOR"
                    },
                    profile: { $ref: "#/definitions/Profile" }
                 }
               }
        } */

        return res
            .status(200)
            .json(
                prepareApiJsonResponse<TSendChallengeResponse>(
                    challengeResponse
                )
            );
    }
);
