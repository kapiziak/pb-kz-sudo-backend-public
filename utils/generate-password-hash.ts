import bcrypt from "bcrypt";

export const generatePasswordHash = async (password: string) => {
    return await bcrypt.hash(password, 10);
};

const password = process.argv[2];
if (!password) {
    console.error("Password is required");
    process.exit(1);
}

generatePasswordHash(password).then((hash) => {
    console.log(`Hash for password "${password}": ${hash}`);

    process.exit(0);
});
