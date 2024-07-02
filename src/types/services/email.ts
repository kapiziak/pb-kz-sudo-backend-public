export type TEmailService = {
    sendRegisterConfirmation: (
        email: string,
        username: string,
        password?: string
    ) => Promise<boolean>;
};
