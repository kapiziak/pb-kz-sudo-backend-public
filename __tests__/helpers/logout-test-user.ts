import app from "../../src/app";
import userService from "../../src/services/userService";
import request from "supertest";
import { TAuthLoginResponse } from "../../src/types/api/auth/auth-responses";

export const useLogoutTestUser = async () => {
    let response;
    response = await request(app).post("/api/auth/logout");

    // expect(response.status).toBe(200);
};
