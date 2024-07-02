import bcrypt from "bcrypt";

export const generateSuperIdSecret = async () => {
    return `=superID==${await bcrypt.hash(
        Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15),
        2
    )}`;
};
