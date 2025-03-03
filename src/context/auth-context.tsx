import { createContext, useEffect } from "react";
import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    GoogleAuthProvider,
    GithubAuthProvider,
} from "firebase/auth";
import { auth } from "../firebaseConfig";
import {
    authWithForm,
    authWithGitHub,
    authWithGoogle,
} from "../assets/api/auth.api";
import { SignInWithForm, SignUpWithForm } from "../forms/AuthForm/auth";
import { formatFirebaseErrorMessages } from "../forms/forms.helpers";
import { signInOrLink } from "../utils/authHelpers";

type AuthContextType = {
    signInWithGoogle: (knownPassword?: string) => Promise<void>;
    signInWithForm: (param: SignInWithForm, knownPassword?: string) => void;
    signUpWithForm: (param: SignUpWithForm) => void;
    signInWithGitHub: (knownPassword?: string) => Promise<void>;
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
        if (!auth) {
            console.error("Firebase auth is not initialized.");
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            console.log(`User State Changed: ${JSON.stringify(user)}`);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const signInWithGoogle = async (knownPassword?: string): Promise<void> => {
        console.log("Sign in with Google");

        const provider = new GoogleAuthProvider();

        try {
            const user = await signInOrLink(provider, knownPassword);
            console.info(`Signed in with Google: ${user?.email}`);

            const idToken = await user?.getIdToken();

            console.info(`Token: ${idToken}`);
            const { user: apiUser } = await authWithGoogle("sign-up", idToken);

            console.info(`User: ${apiUser}`);
            localStorage.setItem("user", JSON.stringify(apiUser));
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

    const signInWithForm = async (
        { email, password }: SignInWithForm,
        knownPassword?: string
    ) => {
        try {
            const user = await signInOrLink(
                new GoogleAuthProvider(),
                knownPassword || password
            );
            console.info(`Signed in with Form: ${user}`);

            const idToken = await user?.getIdToken();

            const { user: apiUser } = await authWithForm("login", {
                idToken,
            });

            console.info(`User: ${JSON.stringify(apiUser)}`);
            localStorage.setItem("user", JSON.stringify(apiUser));
            console.info(`Local storage: ${localStorage.getItem("user")}`);
        } catch (error) {
            const errorCode = (error as { code: string }).code;
            const errorMessage = formatFirebaseErrorMessages(errorCode, "form");
            console.error("Error signing in with Form:", errorMessage);
            throw new Error(errorMessage);
        }
    };

    const signInWithGitHub = async (): Promise<void> => {
        console.log("Sign in with GitHub");
        try {
            const provider = new GithubAuthProvider();

            const user = await signInOrLink(provider);
            console.info(`Signed in with GitHub: ${user}`);

            const idToken = await user?.getIdToken();

            console.info(`Token: ${idToken}`);

            const { user: apiUser } = await authWithGitHub("sign-up", idToken);

            console.info(`User: ${apiUser}`);

            localStorage.setItem("user", JSON.stringify(apiUser));
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
