import { Request, Response, Router } from "express";
import multer from "multer";
import {
    PERMISSION_FILE_UPLOAD_WRITE,
    PERMISSION_PROFILE_SELF_WRITE,
} from "../../../config/permissions-scopes";
import getBlobManager from "../../app/blob-manager/get-blob-manager";
import middlewares from "../../app/middlewares";
import { profileService } from "../../services/profileService";
import {
    TUploadAvatarResponse,
    profileErrors,
} from "../../types/api/profile/profile-responses";
import {
    prepareApiErrorResponse,
    prepareApiJsonResponse,
} from "../../utils/api";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

export const avatarRouter = Router();

avatarRouter.post(
    "/",
    [
        middlewares.authMiddleware,
        middlewares.permissionsMiddleware([
            PERMISSION_FILE_UPLOAD_WRITE,
            PERMISSION_PROFILE_SELF_WRITE,
        ]),
        upload.single("file"),
    ],
    async (req: Request, res: Response) => {
        /*
            #swagger.consumes = ['multipart/form-data']  
            #swagger.parameters['file'] = {
                in: 'formData',
                type: 'file',
                required: 'true',
                description: 'Avatar file',
        } */
        const file = req.file as Express.Multer.File;

        if (!file) {
            return res
                .status(400)
                .json(prepareApiJsonResponse(profileErrors.payloadError));
        }

        const blobManager = getBlobManager();
        let result;
        let profile;

        try {
            result = await blobManager.write(
                "uploads",
                `${req.user?.id ?? "all-users"}`,
                {
                    body: file.buffer,
                    size: file.size,
                    mimetype: file.mimetype,
                    // encoding: file.encoding,
                }
            );

            profile = await profileService.setUserAvatar(
                req.user!!.id,
                result.url
            );
        } catch (e) {
            console.error(e);
            return res
                .status(400)
                .json(prepareApiErrorResponse(profileErrors.avatarUploadError));
        }

        if (!profile) {
            console.error(
                `[profile] Avatar upload error for user ${req.user?.id}`
            );
            return res
                .status(400)
                .json(prepareApiErrorResponse(profileErrors.avatarUploadError));
        }

        /* #swagger.responses[200] = {
            description: 'Avatar uploaded',
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
            prepareApiJsonResponse<TUploadAvatarResponse>({
                profile,
            })
        );
    }
);
