import dotenv from "dotenv";
import getEmailTransporter from "./emailTransporter";

dotenv.config();

async function sendEmail(
    to: string,
    subject: string,
    text: string,
    html: string
) {
    const emailTransporter = getEmailTransporter();

    if (!emailTransporter) {
        return null;
    }

    const mailOptions = {
        from: process.env.SMTP_FROM ?? "noreply@sudo.app",
        to: to,
        subject: subject,
        text: text,
        html: html,
    };
    let result;

    try {
        result = await emailTransporter.sendMail(mailOptions);
        console.log(`[sendEmail] Email sended to `, to);
    } catch (error) {
        console.error("[sendEmail] Email error => ", error);
        result = false;
    }

    return result;
}

export default sendEmail;
