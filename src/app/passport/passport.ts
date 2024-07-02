import passport from "passport";
import {
    Strategy as JwtStrategy,
    ExtractJwt,
    JwtFromRequestFunction,
} from "passport-jwt";
import { PrismaClient } from "@prisma/client";
import { Request } from "express";
import { parse } from "cookie";
import prisma from "../client";

const cookieExtractor: JwtFromRequestFunction = (req) => {
    let jwt: string | null = null;

    const cookies = parse(req.headers.cookie || "");

    if (req && cookies) {
        jwt = cookies["authToken"];
    }

    if (!jwt) {
        return (req.headers["bearer"] || "").toString();
    }

    return jwt;
};

passport.use(
    new JwtStrategy(
        {
            jwtFromRequest: cookieExtractor,
            secretOrKey: process.env.JWT_SECRET,
        },
        async function (jwtPayload, done) {
            try {
                const user = await prisma.user.findUnique({
                    where: {
                        id: jwtPayload.sub,
                    },
                    select: {
                        id: true,
                        email: true,
                        profile: true,
                        role: true,
                    },
                });

                if (!user) {
                    return done(null, false, { message: "User not found" });
                }

                return done(null, user);
            } catch (e) {
                return done(e, false, { message: "Unauth" });
            }
        }
    )
);

export default passport;
