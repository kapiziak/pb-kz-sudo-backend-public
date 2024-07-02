import sendEmail from "../app/email-sender/sendEmail";
import EmailTemplate from "../app/email-template";
import TextContentBlock from "../app/email-template/content-block/text-block/text-block";
import { TEmailService } from "../types/services/email";

export const emailService: TEmailService = {
    sendRegisterConfirmation: async (email, username, password) => {
        const emailTemplate = new EmailTemplate(
            "Account creation confirmation",
            [
                new TextContentBlock(
                    `Your account has been created. Your username is ${username}.`
                ),
            ]
        );

        if (password) {
            emailTemplate.addBlock(
                new TextContentBlock(
                    `Account temporary password: <pre>${password}</pre>`
                )
            );
        }

        emailTemplate.addBlock(
            new TextContentBlock(
                `You can login here: <a href="${
                    process.env.FRONTEND_URL ??
                    "https://pb-kz-sudo.vercel.app/en/login"
                }">SUDO Login Page</a>`
            )
        );

        const result = await sendEmail(
            email,
            "Account creation confirmation",
            emailTemplate.getText(),
            emailTemplate.getHtml()
        );

        if (!result) {
            return false;
        }

        return true;
    },
};
