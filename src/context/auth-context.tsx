import { createContext, useEffect } from "react";
import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    GoogleAuthProvider,
    GithubAuthProvider,
    EmailAuthProvider,
} from "firebase/auth";
import { auth } from "../firebaseConfig";
import {
    authWithForm,
    authWithGitHub,
    authWithGoogle,
} from "../assets/api/auth.api";
import { SignInWithForm, SignUpWithForm } from "../forms/AuthForm/auth";
import { formatFirebaseErrorMessages } from "../forms/forms.helpers";
import { signInOrLinkProvider } from "../utils/authHelpers";
import { logInfo, logError, logWarn, logDebug } from "../utils/loggingHelpers";

type AuthContextType = {
    signInWithGoogle: (knownPassword?: string) => Promise<void>;
    signInWithForm: (
        data: SignInWithForm,
        knownPassword?: string
    ) => Promise<void>;
    signUpWithForm: (data: SignUpWithForm) => Promise<void>;
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
            logError("Firebase auth is not initialized.");
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            logInfo("User State Changed:", user);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    /**
     * Sign In / Link with Google
     */
    const signInWithGoogle = async (knownPassword?: string): Promise<void> => {
        logInfo("Attempting to sign in with Google...");
        const provider = new GoogleAuthProvider();

        try {
            const user = await signInOrLinkProvider(
                auth,
                provider,
                undefined,
                knownPassword
            );
            logInfo("Signed in with Google →", user?.email);

            const idToken = await user?.getIdToken();
            logInfo("Google ID Token:", idToken);

            const { user: apiUser } = await authWithGoogle("login", idToken);
            logInfo("User from backend:", apiUser);

            localStorage.setItem("user", JSON.stringify(apiUser));
            logInfo("Stored user →", localStorage.getItem("user"));
        } catch (error) {
            const errorCode = (error as { code: string }).code;
            const errorMessage = formatFirebaseErrorMessages(
                errorCode,
                "google"
            );
            logError("Error signing in with Google:", errorMessage);
            throw new Error(errorMessage);
        }
    };

    /**
     * Sign Up via Email/Password (Form)
     */
    const signUpWithForm = async (data: SignUpWithForm) => {
        const { email, firstName, lastName, password } = data;
        logInfo("Attempting sign up with form...");

        try {
            const result = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );
            logInfo("Created user with email/password →", result.user?.email);

            const idToken = await result.user.getIdToken();
            const { user } = await authWithForm("sign-up", {
                firstName,
                lastName,
                idToken,
            });

            logInfo("User from backend:", user);

            localStorage.setItem("user", JSON.stringify(user));
            logInfo("Stored user →", localStorage.getItem("user"));
        } catch (error) {
            const errorCode = (error as { code: string }).code;
            const errorMessage = formatFirebaseErrorMessages(errorCode, "form");
            logError("Error signing up with form:", errorMessage);
            throw new Error(errorMessage);
        }
    };

    /**
     * Sign In / Link via Email/Password (Form)
     */
    const signInWithForm = async (
        { email, password }: SignInWithForm,
        knownPassword?: string
    ) => {
        logInfo("Attempting to sign in with email/password...");

        try {
            const provider = new EmailAuthProvider();
            const user = await signInOrLinkProvider(
                auth,
                provider,
                email,
                knownPassword || password
            );
            logInfo("Signed in with email/password →", user?.email);

            const idToken = await user?.getIdToken();
            const { user: apiUser } = await authWithForm("login", {
                idToken,
            });

            logInfo("User from backend:", apiUser);
            localStorage.setItem("user", JSON.stringify(apiUser));

            logInfo("Stored user →", localStorage.getItem("user"));
        } catch (error) {
            const errorCode = (error as { code: string }).code;
            const errorMessage = formatFirebaseErrorMessages(errorCode, "form");
            logError("Error signing in with form:", errorMessage);
            throw new Error(errorMessage);
        }
    };

    /**
     * Sign In / Link via GitHub
     */
    const signInWithGitHub = async (knownPassword?: string): Promise<void> => {
        logInfo("Attempting to sign in with GitHub...");

        try {
            const provider = new GithubAuthProvider();
            const user = await signInOrLinkProvider(
                auth,
                provider,
                undefined,
                knownPassword
            );
            logInfo("Signed in with GitHub →", user?.email);

            const idToken = await user?.getIdToken();
            logInfo("GitHub ID Token:", idToken);

            const { user: apiUser } = await authWithGitHub("login", idToken);
            logInfo("User from backend:", apiUser);

            localStorage.setItem("user", JSON.stringify(apiUser));
            logInfo("Stored user →", localStorage.getItem("user"));
        } catch (error) {
            const errorCode = (error as { code: string }).code;
            const errorMessage = formatFirebaseErrorMessages(
                errorCode,
                "github"
            );
            logError("Error signing in with GitHub:", errorMessage);
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
