const baseURL = "https://portfolio-server-little-lake-1018.fly.dev";

export const AUTH_API_BASE_URL = `${baseURL}/api/auth`;
export const WORKS_API_BASE_URL = `${baseURL}/api/works`;

export const defUrlWorkImage = (folderName, imageName) => {
  return `${baseURL}/api/works/image?project=${folderName}&name=${imageName}`;
};
