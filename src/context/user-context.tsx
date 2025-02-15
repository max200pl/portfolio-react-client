import Cookies from "js-cookie";
import { FC, createContext, useState } from "react";
import { logOutUser } from "../assets/api/auth.api";

interface User {
    name?: string;
    firstName: string;
    lastName: string;
    email: string;
    language: string;
    avatarUrl: string;
    role?: "guest" | "admin" | "user";
}

type UserSessionContextType = {
    isAuth: boolean;
    user?: User;
    clearSession: () => void;
};

export const UserSessionContext = createContext<UserSessionContextType>({
    isAuth: false,
    user: undefined,
    clearSession: () => {},
});

interface Props {
    children: React.ReactNode;
}

const UserSessionContextProvider: FC<Props> = ({ children }) => {
    const [user, setUser] = useState<User>();
    const userCookies = Cookies.get("user");

    const clearSession = async () => {
        try {
            await logOutUser();
        } catch (error) {
            console.error("Error logging out user:", error);
        }

        setUser(undefined);

        Cookies.remove("user");
        Cookies.remove("session");
        Cookies.remove("session.sig");
        console.info("Cookies removed");

        console.info(`
                User ${user?.email} signed out
            `);
    };

    if (userCookies !== undefined && user === undefined) {
        const user = JSON.parse(userCookies ?? "{}");
        setUser(user);
    }

    const contextValue: UserSessionContextType = {
        isAuth: !!user,
        user: user,
        clearSession: clearSession,
    };

    return (
        <UserSessionContext.Provider value={contextValue}>
            {children}
        </UserSessionContext.Provider>
    );
};

export default UserSessionContextProvider;
