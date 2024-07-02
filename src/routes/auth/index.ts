import dotenv from "dotenv";
import { Request, Response, Router } from "express";
import passport from "passport";
import { PERMISSION_USERS_OBJECTS_WRITE } from "../../../config/permissions-scopes";
import middlewares from "../../app/middlewares";
import { emailService } from "../../services/emailService";
import userService from "../../services/userService";
import {
    TAuthLoginResponse,
    TAuthMeResponse,
    TAuthRegisterResponse,
    authErrors,
} from "../../types/api/auth/auth-responses";
import TApiError from "../../types/api/errors/api-errors";
import {
    prepareApiErrorResponse,
    prepareApiJsonResponse,
} from "../../utils/api";
import { generateRandomPassword } from "../../utils/password-utils";
import { passwordRouter } from "./manage-password";

dotenv.config();

export const authRouter = Router();

authRouter.use("/password", passwordRouter);

authRouter.get(
    "/me",
    passport.authenticate("jwt", {
        session: false,
    }),
    (req, res) => {
        /*
    #swagger.responses[200] = {
          description: 'User is logged in',
          schema: {
              $status: "success",
              $serverTime: '1',
              $data: {
                $user: {
                  $id: "1",
                  $email: "hello@kzakrzewski.pl",
                  $role: "VISITOR",
                  profile: {},
                }
              },
            }
} */

        res.json(
            prepareApiJsonResponse<TAuthMeResponse>({
                user: req.user!!,
            })
        );
    }
);

authRouter.post("/login", async (req, res) => {
    /* #swagger.requestBody = {
                required: true,
                content: {
                  "application/json": {
                      schema: {
                      "type": "object",
                         "properties": {
                          login: { type: "string" },
                          password: { type: "string" },
                        }
                      }
                  }
                }
   } */
    const { login, password }: { login: string; password: string } = req.body;

    if (!login || !password) {
        /* #swagger.responses[400] = {
                schema: {
                    $status: 'error',
                    $serverTime: '1',
                    $data: {
                          $code: "AUTH_MISSING_CREDENTIALS",
                          $message: "Missing credentials",
                    }
                 }, description: "Missing credentials."}

    } */

        res.status(400);
        return res.json(
            prepareApiErrorResponse<TApiError>(authErrors.missingCredentials)
        );
    }

    const result = await userService.login(login, password);

    if (!result.ok) {
        /* #swagger.responses[401] = {
            schema: {
                $status: 'error',
                $serverTime: 'some-time',
                $data: {
                      $code: "AUTH_LOGIN_FAILURE",
                      $message: "",
                }
             }, description: "User not found or credentials are invalid."}
    } */
        res.status(401);
        return res.json(
            prepareApiErrorResponse<TApiError>(authErrors.loginFailure)
        );
    }

    const token = userService.signToken(result.user.id);

    /*
      #swagger.responses[200] = {
            description: 'Successful login.',
            schema: {
                $status: "success",
                $serverTime: '1',
                $data: {
                  $token: "some-token",
                  $user: {
                    $id: "1",
                    $email: "hello@kzakrzewski.pl",
                    $role: "VISITOR",
                    profile: {},
                  }
                },
              }
  } */

    res.cookie("authToken", token, {
        httpOnly: true,
        domain: process.env.COOKIE_DOMAIN ?? undefined,
        expires: new Date(Date.now() + 9000000),
        secure: true,
        sameSite: "none",
    });

    res.status(200);
    res.json(
        prepareApiJsonResponse<TAuthLoginResponse>({
            user: result.user,
            token: token,
        })
    );
});

authRouter.post(
    "/register",
    [
        middlewares.authMiddleware,
        middlewares.permissionsMiddleware([PERMISSION_USERS_OBJECTS_WRITE]),
    ],
    async (req: Request, res: Response) => {
        /* #swagger.requestBody = {
              required: true,
              content: {
                "application/json": {
                    schema: {
                    "type": "object",
                       "properties": {
                        $login: { type: "string" },
                        password: { type: "string" },
                      }
                    }
                }
              }
 } */
        const { login, password }: { login: string; password: string } =
            req.body;

        if (!login) {
            res.status(400);
            return res.json(
                prepareApiErrorResponse<TApiError>(
                    authErrors.missingCredentials
                )
            );
        }

        let modifiedPassword = null;

        if (!password || password.length === 0) {
            modifiedPassword = generateRandomPassword();
        }

        const result = await userService.register(
            login,
            password ?? modifiedPassword
        );

        if (!result.ok) {
            res.status(400);
            return res.json(
                prepareApiErrorResponse<TApiError>(authErrors.registerFailure)
            );
        }

        const emailResult = await emailService.sendRegisterConfirmation(
            login,
            login,
            password ?? modifiedPassword
        );

        if (!emailResult) {
            return res
                .status(400)
                .json(prepareApiErrorResponse(authErrors.sendEmailFailure));
        }

        const token = userService.signToken(result.user.id);

        res.json(
            prepareApiJsonResponse<TAuthRegisterResponse>({
                user: result.user,
                token,
            })
        );
    }
);

authRouter.post(
    "/logout",
    passport.authenticate("jwt", {
        session: false,
    }),
    (req, res) => {
        res.clearCookie("authToken", {
            secure: true,
            httpOnly: true,
            sameSite: "none",
        });
        res.json(
            prepareApiJsonResponse({
                ok: true,
            })
        );
    }
);
