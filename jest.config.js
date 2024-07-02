/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    clearMocks: true,
    preset: "ts-jest",
    testEnvironment: "node",
    testMatch: ["**/__tests__/**/*.test.ts"],
    // setupFilesAfterEnv: ["./src/app/mocked-client.ts"],
};
