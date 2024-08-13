const baseURL =
    process.env.REACT_APP_MODE === "development"
        ? "http://localhost:8000"
        : "https://portfolio-server-little-lake-1018.fly.dev";

const BACKEND_URL = "https://portfolio-server-little-lake-1018.fly.dev";

export const AUTH_API_BASE_URL = `${BACKEND_URL}/api/auth`;
export const WORKS_API_BASE_URL = `${BACKEND_URL}/api/works`;

export const defUrlWorkImage = (folderName, imageName) => {
    return `${BACKEND_URL}/api/works/image?project=${folderName}&name=${imageName}`;
};
