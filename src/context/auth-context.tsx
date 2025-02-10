import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Cookies from "js-cookie";
import { createContext, useEffect, useState } from "react";

// Your web app's Firebase configuration using environment variables
const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

type AuthContextType = {
    isAuth: boolean;
    token?: string;
    logOut: () => void;
};

export const AuthContext = createContext<AuthContextType>({
    isAuth: false,
    token: undefined,
    logOut: () => {},
});

interface Props {
    children: React.ReactNode;
}

const AuthContextProvider = ({ children }: Props) => {
    const [token, setToken] = useState<string | undefined>(
        Cookies.get("token")
    );

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const token = await user.getIdToken();
                setToken(token);
                Cookies.set("token", token);
            } else {
                setToken(undefined);
                Cookies.remove("token");
            }
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const logOutHandler = async () => {
        try {
            await auth.signOut(); // Ensure this resolves before state updates
            Cookies.remove("token");
            setToken(undefined);
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    const contextValue: AuthContextType = {
        isAuth: !!token,
        token: token,
        logOut: logOutHandler,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContextProvider;
