import authMiddleware from "./auth-middleware";
import permissionsMiddleware from "./permissions-middleware";

const middlewares = {
    authMiddleware: authMiddleware,
    permissionsMiddleware: permissionsMiddleware,
};

export default middlewares;
