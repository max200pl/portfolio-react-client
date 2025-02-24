export const log = (message: string, data?: any) => {
    console.log(`[LOG] ${message}`, data);
};

export const logError = (message: string, error: any) => {
    console.error(`[ERROR] ${message}`, error);
};
