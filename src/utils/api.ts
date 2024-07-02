export const prepareApiJsonResponse = <T>(obj: T) => {
    return {
        status: "success",
        serverTime: new Date().getTime(),
        data: obj,
    } as TApiResponse<T>;
};

export const prepareApiErrorResponse = <T>(obj: T) => {
    return {
        status: "error",
        serverTime: new Date().getTime(),
        data: obj,
    } as TApiResponse<T>;
};
