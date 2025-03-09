import { baseQuery } from "./api.helper";
import { AUTH_API_BASE_URL } from "./constants";
import { SignUpWithForm, UserInfo } from "../../forms/AuthForm/auth";

export type TypeActionAuth = "sign-up" | "login";

export type FIREBASE_ID_TOKEN = string | undefined;

export const fetchUserProfile = async (idToken: FIREBASE_ID_TOKEN) => {
    const baseQueryFn = baseQuery;

    try {
        const { user } = await baseQueryFn<{ user: UserInfo }>({
            url: `${AUTH_API_BASE_URL}/profile`,
            body: {
                idToken,
            },
            credentials: "include",
            method: "post",
        });

        return user;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error;
    }
};

export const authWithGoogle = (
    type: TypeActionAuth,
    idToken: FIREBASE_ID_TOKEN
) => {
    const baseQueryFn = baseQuery;

    return baseQueryFn<{ user: UserInfo }>({
        url: `${AUTH_API_BASE_URL}/${type}/google`,
        body: {
            idToken,
        },
        method: "post",
    });
};

export const authWithForm = (
    type: TypeActionAuth,
    submitFormValues:
        | {
              firstName: SignUpWithForm["firstName"];
              lastName: SignUpWithForm["lastName"];
              idToken: FIREBASE_ID_TOKEN;
          }
        | { idToken: FIREBASE_ID_TOKEN }
) => {
    const baseQueryFn = baseQuery;

    return baseQueryFn<{ user: UserInfo }>({
        url: `${AUTH_API_BASE_URL}/${type}/form`,
        body: submitFormValues,
        method: "post",
    });
};

export const authWithGitHub = (
    type: TypeActionAuth,
    idToken: FIREBASE_ID_TOKEN
) => {
    const baseQueryFn = baseQuery;

    return baseQueryFn<{ user: UserInfo }>({
        url: `${AUTH_API_BASE_URL}/${type}/github`,
        body: {
            idToken,
        },
        method: "post",
    });
};

export const logoutUser = async () => {
    const baseQueryFn = baseQuery;

    try {
        await baseQueryFn<void>({
            url: `${AUTH_API_BASE_URL}/logout`,
            method: "post",
        });
    } catch (error) {
        console.error("Error logging out user:", error);
        throw error;
    }
};
