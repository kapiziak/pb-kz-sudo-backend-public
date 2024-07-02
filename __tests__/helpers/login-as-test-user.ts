import app from "../../src/app";
import userService from "../../src/services/userService";
import request from "supertest";
import { TAuthLoginResponse } from "../../src/types/api/auth/auth-responses";
interface Data {
    login: string;
    password: string;
}

export const useLoginTestUser = async ({ login, password }: Data) => {
    let response;

    response = await request(app).post("/api/auth/login").send({
        login,
        password,
    });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("success");

    const data = response.body.data as TApiResponse<TAuthLoginResponse>;
    expect(data.token.length).toBeGreaterThan(3);
    expect(data.user.email).toBe(login);

    return data;
};
