import cors from "cors";
import express, { Express, Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerFile from "../swagger/swagger-output.json";
import passport from "./app/passport/passport";
import { defaultApiRoute } from "./routes/api";
import { prepareApiJsonResponse } from "./utils/api";

const app: Express = express();

app.use(
    cors({
        credentials: true,
        origin: [
            "http://localhost:3000",
            "capacitor-electron://-",
            "https://pb-kz-sudo.vercel.app",
            "capacitor://-",
            "capacitor://localhost",
            "capacitor://sudo-app.azurewebsites.net",
        ],
    })
);
app.use(passport.initialize());
app.use(express.json());
app.get("/api-docs/swagger.json", (_, res) => res.json(swaggerFile));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use("/api", defaultApiRoute);

app.get("/", async (req: Request, res: Response) => {
    res.json(prepareApiJsonResponse<string>(`hi!! i'm alive! 🐓`));
});

// TODO: remove before production
// app.use((req: Request, res: Response) => {
//     console.log("There is an error");
//     res.status(500).json(
//         prepareApiErrorResponse<TApiError>({
//             code: "SERVER_ERROR",
//             message: "Server error",
//         })
//     );
// });

export default app;
