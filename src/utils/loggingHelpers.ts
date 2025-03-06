const getCallerInfo = () => {
    const stack = new Error().stack;
    if (!stack) return "";
    const stackLines = stack.split("\n");
    if (stackLines.length < 4) return "";
    const callerLine = stackLines[3];
    const match = callerLine.match(/at (.+) \((.+):(\d+):(\d+)\)/);
    if (!match) return "";
    const [, , file, line] = match;
    return `${file}:${line}`;
};

export const logInfo = (message: string, ...optionalParams: any[]) => {
    console.info(
        `%c[INFO]%c ${message} %c@ ${getCallerInfo()}`,
        "color: #4caf50; font-weight: bold;",
        "",
        "color: #9e9e9e; font-style: italic;",
        ...optionalParams
    );
};

export const logError = (message: string, ...optionalParams: any[]) => {
    console.error(
        `%c[ERROR]%c ${message} %c@ ${getCallerInfo()}`,
        "color: #f44336; font-weight: bold;",
        "",
        "color: #9e9e9e; font-style: italic;",
        ...optionalParams
    );
};

export const logWarn = (message: string, ...optionalParams: any[]) => {
    console.warn(
        `%c[WARN]%c ${message} %c@ ${getCallerInfo()}`,
        "color: #ff9800; font-weight: bold;",
        "",
        "color: #9e9e9e; font-style: italic;",
        ...optionalParams
    );
};

export const logDebug = (message: string, ...optionalParams: any[]) => {
    console.debug(
        `%c[DEBUG]%c ${message} %c@ ${getCallerInfo()}`,
        "color: #3f51b5; font-weight: bold;",
        "",
        "color: #9e9e9e; font-style: italic;",
        ...optionalParams
    );
};
