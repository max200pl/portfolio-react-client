export interface UserInfo {
    email: string;
    firstName: string;
    lastName: string;
    fullName: string;
    displayName: string;
    roles: "user" | "admin";
    settings: {
        theme: "light" | "dark";
        language: "en";
    };
    photoURL: string;
}

export type SignUpWithForm = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
};
