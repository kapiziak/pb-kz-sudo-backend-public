import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

function getEmailTransporter() {
    if (process.env.NODE_ENV === "test") {
        // Mocked transporter for tests environment
        return null;
    }

    if (
        !process.env.SMTP_HOST ||
        !process.env.SMTP_PORT ||
        !process.env.SMTP_USER ||
        !process.env.SMTP_PASSWORD
    ) {
        throw new Error("[emailTransporter] SMTP configuration is missing");
    }

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT),
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
        },
    });

    return transporter;
}

export default getEmailTransporter;
