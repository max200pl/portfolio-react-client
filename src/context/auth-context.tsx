import React, { createContext, useEffect, useState } from "react";
import {
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signOut as firebaseSignOut,
    GoogleAuthProvider,
    GithubAuthProvider,
    EmailAuthProvider,
} from "firebase/auth";
import { auth } from "../firebaseConfig";
import {
    authWithForm,
    authWithGoogle,
    authWithGitHub,
    logoutUser,
} from "../assets/api/auth.api";
import {
    SignInWithForm,
    SignUpWithForm,
    UserInfo,
} from "../forms/AuthForm/auth";
import { signInOrLinkProvider } from "../utils/authHelpers";
import { logInfo, logError } from "../utils/loggingHelpers";

// -------------------------------------------------------
// Type describing the methods we provide through the context
// -------------------------------------------------------
type AuthContextType = {
    signInWithGoogle: (knownPassword?: string) => Promise<void>;
    signInWithForm: (
        data: SignInWithForm,
        knownPassword?: string
    ) => Promise<void>;
    signUpWithForm: (data: SignUpWithForm) => Promise<void>;
    signInWithGitHub: (knownPassword?: string) => Promise<void>;
    signOut: () => Promise<void>;
    user?: UserInfo | null;
    loading: boolean;
};

export const AuthContext = createContext<AuthContextType>({
    signInWithForm: async () => {},
    signUpWithForm: async () => {},
    signInWithGoogle: async () => {},
    signInWithGitHub: async () => {},
    signOut: async () => {},
    user: null,
    loading: true,
});

interface Props {
    children: React.ReactNode;
}

const AuthContextProvider = ({ children }: Props) => {
    const [user, setUser] = useState<UserInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [justLoggedIn, setJustLoggedIn] = useState(false);

    // -------------------------------------------------------
    // 1. On first render, try to get user from localStorage
    //    (to avoid "flashing").
    // -------------------------------------------------------
    useEffect(() => {
        const storedUser = localStorage.getItem("user");

        if (storedUser) {
            try {
                logInfo("User found in localStorage:", storedUser);
                const parsed = JSON.parse(storedUser);
                setUser(parsed);
            } catch (err) {
                logError("Error reading user from localStorage", err);
                localStorage.removeItem("user");
            }
        } else {
            logInfo("No user found in localStorage");
        }
    }, []);

    // -------------------------------------------------------
    // 2. Subscribe to Firebase auth state changes:
    //    - If firebaseUser == null => sign out
    //    - Otherwise, get idToken + profile from backend => setUser
    // -------------------------------------------------------
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (justLoggedIn) {
                // If justLoggedIn is true, we've already set the user
                logInfo("Just logged in, skipping...");
                setJustLoggedIn(false);
                return;
            }

            setLoading(true);

            if (!firebaseUser) {
                logInfo("Firebase: No user → signing out");
                setUser(null);
                localStorage.removeItem("user");
                setLoading(false);
                return;
            }

            try {
                logInfo("Firebase: user found:", firebaseUser.email);
                // const idToken = await firebaseUser.getIdToken();
                // const userProfile = await fetchUserProfile(idToken);

                // setUser(userProfile);
                // localStorage.setItem("user", JSON.stringify(userProfile));

                // logInfo("User profile received:", userProfile);
            } catch (error) {
                logError("Error fetching profile:", error);

                // Probably the token expired or the backend is not responding
                await firebaseSignOut(auth);
                await logoutUser();

                setUser(null);
                localStorage.removeItem("user");
            } finally {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    // -------------------------------------------------------
    // Sign in/Sign up methods
    // -------------------------------------------------------

    // Google
    const signInWithGoogle = async (knownPassword?: string): Promise<void> => {
        logInfo("Attempting to sign in with Google...");
        const provider = new GoogleAuthProvider();

        try {
            const fbUser = await signInOrLinkProvider(
                auth,
                provider,
                undefined,
                knownPassword
            );
            logInfo("Signed in with Google →", fbUser?.email);

            const idToken = await fbUser?.getIdToken();
            if (!idToken) {
                throw new Error(
                    "Failed to get idToken from Firebase (Google)."
                );
            }
            const { user: apiUser } = await authWithGoogle("login", idToken);

            localStorage.setItem("user", JSON.stringify(apiUser));
            logInfo("Stored user →", localStorage.getItem("user"));
            setJustLoggedIn(true);
        } catch (error) {
            logError("Error signing in with Google:", error);
            throw error;
        }
    };

    // -------------------------------------------------------
    // Email/Password (SignUp)
    // -------------------------------------------------------
    const signUpWithForm = async (data: SignUpWithForm) => {
        const { email, firstName, lastName, password } = data;
        logInfo("Attempting sign up with form...");

        try {
            const result = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );
            logInfo(
                "Firebase created user (email/password) →",
                result.user?.email
            );

            const idToken = await result.user.getIdToken();
            const { user: newUser } = await authWithForm("sign-up", {
                firstName,
                lastName,
                idToken,
            });

            logInfo("User from backend:", newUser);

            localStorage.setItem("user", JSON.stringify(newUser));
            logInfo("Stored user →", localStorage.getItem("user"));
            setJustLoggedIn(true);
        } catch (error) {
            logError("Error signing up with form:", error);
            throw error;
        }
    };

    // -------------------------------------------------------
    // Email/Password (SignIn)
    // -------------------------------------------------------
    const signInWithForm = async (
        { email, password }: SignInWithForm,
        knownPassword?: string
    ) => {
        logInfo("Attempting to sign in with email/password...");

        try {
            const provider = new EmailAuthProvider();
            const fbUser = await signInOrLinkProvider(
                auth,
                provider,
                email,
                knownPassword || password
            );
            logInfo("Signed in with email/password →", fbUser?.email);

            const idToken = await fbUser?.getIdToken();
            if (!idToken) {
                throw new Error("Failed to get idToken from Firebase (Email).");
            }

            const { user: apiUser } = await authWithForm("login", { idToken });
            logInfo("User from backend:", apiUser);

            localStorage.setItem("user", JSON.stringify(apiUser));
            logInfo("Stored user →", localStorage.getItem("user"));
            setJustLoggedIn(true);
        } catch (error) {
            logError("Error signing in with form:", error);
            throw error;
        }
    };
    // -------------------------------------------------------
    // GitHub
    // -------------------------------------------------------
    const signInWithGitHub = async (knownPassword?: string): Promise<void> => {
        logInfo("Attempting to sign in with GitHub...");
        const provider = new GithubAuthProvider();

        try {
            const fbUser = await signInOrLinkProvider(
                auth,
                provider,
                undefined,
                knownPassword
            );
            logInfo("Signed in with GitHub →", fbUser?.email);

            const idToken = await fbUser?.getIdToken();
            if (!idToken) {
                throw new Error(
                    "Failed to get idToken from Firebase (GitHub)."
                );
            }
            const { user: apiUser } = await authWithGitHub("login", idToken);

            localStorage.setItem("user", JSON.stringify(apiUser));
            logInfo("Stored user →", localStorage.getItem("user"));
            setJustLoggedIn(true);
        } catch (error) {
            logError("Error signing in with GitHub:", error);
            throw error;
        }
    };

    // -------------------------------------------------------
    // Logout
    // -------------------------------------------------------
    const signOut = async (): Promise<void> => {
        logInfo("Attempting to sign out...");

        try {
            await firebaseSignOut(auth);
            localStorage.removeItem("user");
            await logoutUser(); // Your backend request, if needed

            logInfo("Successfully signed out.");
        } catch (error) {
            logError("Error signing out:", error);
            throw error;
        }
    };

    // -------------------------------------------------------
    // Collecting context
    // -------------------------------------------------------
    const contextValue: AuthContextType = {
        user,
        loading,
        signInWithGoogle,
        signInWithForm,
        signUpWithForm,
        signInWithGitHub,
        signOut,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContextProvider;
