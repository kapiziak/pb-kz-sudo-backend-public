export const isJestRunning = () => {
    return process.env.JEST_WORKER_ID !== undefined;
};
