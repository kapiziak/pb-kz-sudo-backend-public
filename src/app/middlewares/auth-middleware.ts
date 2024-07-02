import { NextFunction, Request, Response } from "express";
import passport from "passport";
import { prepareApiErrorResponse } from "../../utils/api";
import TApiError from "../../types/api/errors/api-errors";

const authMiddleware = function (
    req: Request,
    res: Response,
    next: NextFunction
) {
    passport.authenticate(
        "jwt",
        {
            session: false,
        },
        (err: Error, user: any, info: any) => {
            req.user = user;
            if (err || !user) {
                return res.status(401).json(
                    prepareApiErrorResponse<TApiError>({
                        code: "AUTH_ERROR",
                        message:
                            "You need to be logged in to access this resource",
                    })
                );
            }

            return next();
        }
    )(req, res, next);
};

export default authMiddleware;
