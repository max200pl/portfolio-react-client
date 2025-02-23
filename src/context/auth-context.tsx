import { initializeApp } from "firebase/app";
import {
    createUserWithEmailAndPassword,
    getAuth,
    GithubAuthProvider,
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithPopup,
} from "firebase/auth";
import { createContext, useEffect } from "react";
import {
    authWithForm,
    authWithGitHub,
    authWithGoogle,
} from "../assets/api/auth.api";
import { SignUpWithForm } from "../forms/AuthForm/auth";

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
    signInWithGoogle: () => void;
    signInWithForm: () => void;
    signUpWithForm: (param: SignUpWithForm) => void;
    signInWithGitHub: () => void;
};

export const AuthContext = createContext<AuthContextType>({
    signInWithGoogle: () => {},
    signInWithForm: () => {},
    signUpWithForm: () => {},
    signInWithGitHub: () => {},
});

interface Props {
    children: React.ReactNode;
}

const AuthContextProvider = ({ children }: Props) => {
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            console.log(`User State Changed: ${user?.email}`);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const signInWithGoogle = async () => {
        console.log("Sign in with Google");

        const provider = new GoogleAuthProvider();

        try {
            const result = await signInWithPopup(auth, provider);
            console.info(`Signed in with Google: ${result.user?.email}`);

            const idToken = await result.user?.getIdToken();

            console.info(`Token: ${idToken}`);
            const { user } = await authWithGoogle("sign-up", idToken);

            console.info(`User: ${user}`);
            localStorage.setItem("user", JSON.stringify(user));
            console.info(`Local storage: ${localStorage.getItem("user")}`);
        } catch (error) {
            console.error("Error signing in with Google:", error);
        }
    };

    const signUpWithForm = async ({
        email,
        firstName,
        lastName,
        password,
    }: SignUpWithForm) => {
        console.log("Sign up with Form", firstName, lastName);

        try {
            const result = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

            const idToken = await result.user?.getIdToken();

            const { user } = await authWithForm("sign-up", {
                firstName,
                lastName,
                idToken,
            });

            console.info(`User: ${user}`);

            localStorage.setItem("user", JSON.stringify(user));
            console.info(`Local storage: ${localStorage.getItem("user")}`);
        } catch (error) {
            console.error("Error signing up with Form:", error);
        }
    };

    const signInWithForm = () => {
        console.log("Sign in with Form");
    };

    const signInWithGitHub = async () => {
        console.log("Sign in with GitHub");

        const provider = new GithubAuthProvider();

        const result = await signInWithPopup(auth, provider);

        const idToken = await result.user?.getIdToken();

        console.info(`Token: ${idToken}`);

        const { user } = await authWithGitHub("sign-up", idToken);

        console.info(`User: ${user}`);

        localStorage.setItem("user", JSON.stringify(user));
        console.info(`Local storage: ${localStorage.getItem("user")}`);
    };

    const contextValue = {
        signInWithGoogle,
        signInWithForm,
        signUpWithForm,
        signInWithGitHub,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContextProvider;
