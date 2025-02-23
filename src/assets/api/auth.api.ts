import { baseQuery } from "./api.helper";
import { SubmitSignInFormValues } from "../../pages/Auth/AuthSignIn/AuthSignIn";
import { AUTH_API_BASE_URL } from "./constants";
import { SignUpWithForm, UserInfo } from "../../forms/AuthForm/auth";

export type TypeActionAuth = "sign-up" | "login";

export type FIREBASE_ID_TOKEN = string;

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
        | SubmitSignInFormValues
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
        credentials: "include",
    });
};

export const logOutUser = async () => {
    const baseQueryFn = baseQuery;
    console.log(AUTH_API_BASE_URL, "AUTH_API_BASE_URL");
    try {
        await baseQueryFn<void>({
            url: `${AUTH_API_BASE_URL}/logout`,
            method: "post",
            contentType: "application/json",
            credentials: "include",
        });
    } catch (error) {
        console.error("Error logging out user:", error);
        throw error;
    }
};
