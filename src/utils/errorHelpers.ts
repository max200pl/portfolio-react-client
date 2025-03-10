import { logError } from "./loggingHelpers";

export const handleError = (error: unknown, context: string): string => {
    const errorMessage =
        (error as Error).message || "An unknown error occurred";
    logError(`Error in ${context}:`, errorMessage);
    return errorMessage;
};
