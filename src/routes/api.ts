import { Router } from "express";

import { prepareApiJsonResponse } from "../utils/api";
import { authRouter } from "./auth";
import { authorizationsRouter } from "./authorizations";
import { entryRouter } from "./entry";
import { facilitiesRouter } from "./facilities";
import { profileRouter } from "./profile";
import { statisticsRouter } from "./statistics";
import { superIdRouter } from "./super-id";
import { usersRouter } from "./users";

export const defaultApiRoute = Router();

defaultApiRoute.use("/auth", authRouter);
defaultApiRoute.use("/users", usersRouter);
defaultApiRoute.use("/facilities", facilitiesRouter);
defaultApiRoute.use("/authorizations", authorizationsRouter);
defaultApiRoute.use("/super-id", superIdRouter);
defaultApiRoute.use("/entry", entryRouter);
defaultApiRoute.use("/statistics", statisticsRouter);
defaultApiRoute.use("/profile", profileRouter);

defaultApiRoute.get("/", (req, res) => {
    res.json(prepareApiJsonResponse<string>(`hi! api alive! 🐓`));
});

// defaultApiRoute.get("/test", async (req, res) => {
//     const emailTemplate = new EmailTemplate("Witamy w SUDO!", [
//         new TextContentBlock("Super ze jestes"),
//         new TextContentBlock("Dzieki!"),
//     ]);

//     console.log(emailTemplate.getHtml());

//     await sendEmail(
//         "nznajomypl@gmail.com",
//         "test",
//         emailTemplate.getText(),
//         emailTemplate.getHtml()
//     );

//     return res.status(200).json({
//         status: "OK",
//     });
// });
