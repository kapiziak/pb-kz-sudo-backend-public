import { Role } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../app/client";
import { TServiceUser } from "../types/services/user";

const userService: TServiceUser = {
    getAllUsers: async () => {
        const users = await prisma.user.findMany({
            orderBy: {
                id: "asc",
            },
            select: {
                id: true,
                email: true,
                role: true,
                profile: true,
            },
        });

        if (!users) return [];

        return users;
    },
    login: async (username, password) => {
        const foundUser = await prisma.user.findUnique({
            where: {
                email: username,
            },
        });

        if (!foundUser) {
            return {
                ok: false,
                message: "User not found",
            };
        }

        const isEqual = await bcrypt.compare(password, foundUser.password);

        if (!isEqual) {
            return {
                ok: false,
                message: "Password is incorrect",
            };
        }

        return {
            ok: true,
            user: {
                id: foundUser.id,
                email: foundUser.email,
                role: foundUser.role,
            },
        };
    },
    register: async (username, password) => {
        const foundUser = await prisma.user.findUnique({
            where: {
                email: username,
            },
        });

        if (foundUser) {
            return {
                ok: false,
                message: "User already exists",
            };
        }

        const hash = await bcrypt.hash(password, 10);

        const data = {
            email: username,
            password: hash,
            role: Role.VISITOR,
        };

        const createdUser = await prisma.user.create({ data });

        return {
            ok: true,
            user: {
                id: createdUser.id,
                email: createdUser.email,
                role: createdUser.role,
            },
        };
    },
    signToken: (userId: number) => {
        if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET not found");

        return jwt.sign(
            {
                iss: "hello@kzakrzewski.pl",
                sub: userId,
                iat: new Date().getTime(),
                exp: new Date().setDate(new Date().getDate() + 1),
            },
            process.env.JWT_SECRET
        );
    },
    delete: async (userId: number) => {
        const result = await prisma.user.delete({
            where: {
                id: userId,
            },
        });

        if (!result) return false;

        return true;
    },
    changeRole: async (userId: number, role: Role) => {
        const result = await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                role,
            },
        });

        if (!result) return false;

        return true;
    },
    changePassword: async (userId: number, newPassword: string) => {
        const hash = await bcrypt.hash(newPassword, 10);

        const result = await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                password: hash,
            },
        });

        if (!result) return false;

        return true;
    },
};

export default userService;
