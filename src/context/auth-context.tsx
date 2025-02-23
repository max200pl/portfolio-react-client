import { initializeApp } from "firebase/app";
import {
    createUserWithEmailAndPassword,
    getAuth,
    GithubAuthProvider,
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signInWithPopup,
} from "firebase/auth";
import { createContext, useEffect } from "react";
import {
    authWithForm,
    authWithGitHub,
    authWithGoogle,
} from "../assets/api/auth.api";
import { SignInWithForm, SignUpWithForm } from "../forms/AuthForm/auth";
import { formatFirebaseErrorMessages } from "../forms/forms.helpers";

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
    signInWithGoogle: () => Promise<void>;
    signInWithForm: (param: SignInWithForm) => void;
    signUpWithForm: (param: SignUpWithForm) => void;
    signInWithGitHub: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
    signInWithForm: async () => {},
    signUpWithForm: async () => {},
    signInWithGoogle: async () => {},
    signInWithGitHub: async () => {},
});

interface Props {
    children: React.ReactNode;
}

const AuthContextProvider = ({ children }: Props) => {
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            console.log(`User State Changed: ${JSON.stringify(user)}`);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const signInWithGoogle = async (): Promise<void> => {
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
            const errorCode = (error as { code: string }).code;
            const errorMessage = formatFirebaseErrorMessages(
                errorCode,
                "google"
            );
            console.error("Error signing in with Google:", errorMessage);
            throw new Error(errorMessage);
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
            const errorCode = (error as { code: string }).code;
            const errorMessage = formatFirebaseErrorMessages(errorCode, "form");
            console.error("Error signing up with Form:", errorMessage);
            throw new Error(errorMessage);
        }
    };

    const signInWithForm = async ({ email, password }: SignInWithForm) => {
        try {
            const result = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

            console.info(`Signed in with Form: ${result}`);

            const idToken = await result.user?.getIdToken();

            const { user } = await authWithForm("login", {
                idToken,
            });

            console.info(`User: ${JSON.stringify(user)}`);
            localStorage.setItem("user", JSON.stringify(user));
            console.info(`Local storage: ${localStorage.getItem("user")}`);
        } catch (error) {
            const errorCode = (error as { code: string }).code;
            const errorMessage = formatFirebaseErrorMessages(errorCode, "form");
            console.error("Error signing up with Form:", errorMessage);
            throw new Error(errorMessage);
        }
    };

    const signInWithGitHub = async (): Promise<void> => {
        console.log("Sign in with GitHub");
        try {
            const provider = new GithubAuthProvider();

            const result = await signInWithPopup(auth, provider);

            console.info(`Signed in with GitHub: ${result}`);

            const idToken = await result.user?.getIdToken();

            console.info(`Token: ${idToken}`);

            const { user } = await authWithGitHub("sign-up", idToken);

            console.info(`User: ${user}`);

            localStorage.setItem("user", JSON.stringify(user));
            console.info(`Local storage: ${localStorage.getItem("user")}`);
        } catch (error) {
            const errorCode = (error as { code: string }).code;
            const errorMessage = formatFirebaseErrorMessages(
                errorCode,
                "github"
            );
            console.error("Error signing in with GitHub:", errorMessage);
            throw new Error(errorMessage);
        }
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
