import { FirebaseError } from "firebase/app";
import {
    signInWithPopup,
    signInWithEmailAndPassword,
    linkWithPopup,
    fetchSignInMethodsForEmail,
    GoogleAuthProvider,
    GithubAuthProvider,
} from "firebase/auth";
import { auth } from "../firebaseConfig";

// Universal method for signing in or linking with any OAuth provider
export async function signInOrLink(
    provider: GoogleAuthProvider | GithubAuthProvider,
    knownPassword?: string
) {
    try {
        // 1. Attempt to sign in or register the user via signInWithPopup
        const result = await signInWithPopup(auth, provider);
        console.log(
            "Successfully signed in (or created a new user):",
            result.user
        );
        return result.user;
    } catch (error) {
        // 2. If the account exists but with a different provider, catch "ACCOUNT_EXISTS_WITH_DIFFERENT_CREDENTIAL"
        const firebaseError = error as FirebaseError;

        console.log(`
                Firebase Error Code: ${firebaseError.code}
                Firebase Error Message: ${firebaseError.message}
                Custom Data: ${firebaseError.customData}
            `);
        if (
            firebaseError.code ===
            "auth/account-exists-with-different-credential"
        ) {
            // Get the email that caused the conflict
            const email = firebaseError.customData?.email as string;
            // Find out which sign-in methods are already linked to this email
            const existingMethods = await fetchSignInMethodsForEmail(
                auth,
                email
            );

            // ----- If the account is linked to Email/Password -----
            if (existingMethods.includes("password")) {
                if (!knownPassword) {
                    throw new Error(
                        "Password is required for Email/Password accounts."
                    );
                }

                // Sign in via Email/Password
                const existingUserCredential = await signInWithEmailAndPassword(
                    auth,
                    email,
                    knownPassword
                );
                // Now link the new provider (Google or GitHub) to this account
                const linkResult = await linkWithPopup(
                    existingUserCredential.user,
                    provider
                );
                console.log(
                    "Linked provider to Email/Password:",
                    linkResult.user
                );
                return linkResult.user;
            }

            // ----- If the account is linked to Google -----
            if (existingMethods.includes("google.com")) {
                // Sign in via Google
                const googleProvider = new GoogleAuthProvider();
                const googleSignInResult = await signInWithPopup(
                    auth,
                    googleProvider
                );

                // Link the new provider (e.g., GitHub) to this Google account
                const linkResult = await linkWithPopup(
                    googleSignInResult.user,
                    provider
                );
                console.log(
                    "Linked GitHub to Google account:",
                    linkResult.user
                );
                return linkResult.user;
            }

            // ----- If the account is linked to GitHub -----
            if (existingMethods.includes("github.com")) {
                // Sign in via GitHub
                const githubProvider = new GithubAuthProvider();
                const githubSignInResult = await signInWithPopup(
                    auth,
                    githubProvider
                );

                // Link the new provider (e.g., Google) to this GitHub account
                const linkResult = await linkWithPopup(
                    githubSignInResult.user,
                    provider
                );
                console.log(
                    "Linked Google to GitHub account:",
                    linkResult.user
                );
                return linkResult.user;
            }

            // If other providers are encountered (Facebook, Twitter), the handling is similar:
            // if (existingMethods.includes("facebook.com")) { ... }
            // if (existingMethods.includes("twitter.com")) { ... }
        } else {
            // Handle any other errors
            console.error("Error during sign-in:", error);
            throw error;
        }
    }
}
