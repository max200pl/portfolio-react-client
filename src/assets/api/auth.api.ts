import { TokenResponse } from "@react-oauth/google";
import { baseQuery } from "./api.helper";
import { SubmitSignUpFormValues } from "../../pages/Auth/AuthSignUp/AuthSignUp";
import { SubmitSignInFormValues } from "../../pages/Auth/AuthSignIn/AuthSignIn";
import { AUTH_API_BASE_URL } from "./constants";

export type TypeActionAuth = "sign-up" | "login";

export const getAuthGoole = (
    type: TypeActionAuth,
    codeResponse: TokenResponse
) => {
    const baseQueryFn = baseQuery;

    return baseQueryFn({
        url: `${AUTH_API_BASE_URL}/${type}/google`,
        body: codeResponse,
        method: "post",
        credentials: "include",
    });
};

export const getAuthForm = (
    type: TypeActionAuth,
    submitFormValues: SubmitSignUpFormValues | SubmitSignInFormValues
) => {
    const baseQueryFn = baseQuery;

    return baseQueryFn({
        url: `${AUTH_API_BASE_URL}/${type}/form`,
        body: submitFormValues,
        method: "post",
    });
};

export const getAuthGitHub = (
    type: TypeActionAuth,
    codeResponse: { code: string }
) => {
    const baseQueryFn = baseQuery;

    return baseQueryFn({
        url: `${AUTH_API_BASE_URL}/${type}/github`,
        body: codeResponse,
        method: "post",
        credentials: "include",
    });
};

export const logOutUser = async () => {
    const baseQueryFn = baseQuery;
    console.log(AUTH_API_BASE_URL, "AUTH_API_BASE_URL");
    try {
        const response = await baseQueryFn({
            url: `${AUTH_API_BASE_URL}/logout`,
            method: "post",
            contentType: "application/json",
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error("Failed to log out");
        }

        return response.json();
    } catch (error) {
        console.error("Error logging out user:", error);
        throw error;
    }
};
