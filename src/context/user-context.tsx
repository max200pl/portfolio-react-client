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

type UserContextType = {
    isAuth: boolean;
    user?: User;
    authUser: (user: User) => void;
    logOutUser: () => void;
};

export const UserContext = createContext<UserContextType>({
    isAuth: false,
    user: undefined,
    authUser: (user) => {},
    logOutUser: () => {},
});

interface Props {
    children: React.ReactNode;
}

const UserContextProvider: FC<Props> = ({ children }) => {
    const [user, setUser] = useState<User>();
    const userCookies = Cookies.get("user");

    const authUserHandler = (user: User) => {
        Cookies.set("user", JSON.stringify(user));
        setUser(user);
    };

    const logOutUserHandler = async () => {
        console.info("Attempting to log out user");
        const response = await logOutUser();
        console.info("Response from server:", response);

        setUser(undefined);
        console.info("User state set to undefined");

        Cookies.remove("user");
        Cookies.remove("session");
        Cookies.remove("session.sig");
        console.info("Cookies removed");

        console.info("User logged out");
    };

    if (userCookies !== undefined && user === undefined) {
        const user = JSON.parse(userCookies ?? "{}");
        setUser(user);
    }

    const contextValue: UserContextType = {
        isAuth: !!user,
        user: user,
        authUser: authUserHandler,
        logOutUser: logOutUserHandler,
    };

    return (
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContextProvider;
