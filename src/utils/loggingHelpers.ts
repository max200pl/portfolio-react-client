export const logInfo = (message: string, ...optionalParams: any[]) => {
    console.info(
        `%c[INFO]%c ${message}`,
        "color: #4caf50; font-weight: bold;",
        "",
        ...optionalParams
    );
};

export const logError = (message: string, ...optionalParams: any[]) => {
    console.error(
        `%c[ERROR]%c ${message}`,
        "color: #f44336; font-weight: bold;",
        "",
        ...optionalParams
    );
};

export const logWarn = (message: string, ...optionalParams: any[]) => {
    console.warn(
        `%c[WARN]%c ${message}`,
        "color: #ff9800; font-weight: bold;",
        "",
        ...optionalParams
    );
};

export const logDebug = (message: string, ...optionalParams: any[]) => {
    console.debug(
        `%c[DEBUG]%c ${message}`,
        "color: #3f51b5; font-weight: bold;",
        "",
        ...optionalParams
    );
};
