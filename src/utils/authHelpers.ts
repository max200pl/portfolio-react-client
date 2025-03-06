import { FirebaseError } from "firebase/app";
import {
    Auth,
    User,
    AuthProvider,
    EmailAuthProvider,
    signInWithPopup,
    signInWithEmailAndPassword,
    linkWithPopup,
    linkWithCredential,
} from "firebase/auth";
import { logInfo, logError, logWarn, logDebug } from "./loggingHelpers";

/**
 * Универсальная функция для входа или линковки нового провайдера.
 *
 * Логика:
 * 1. Если пользователь уже авторизован (auth.currentUser !== null):
 *    - Для Email/Password → linkWithCredential
 *    - Для OAuth (Google/GitHub) → linkWithPopup
 *
 * 2. Если пользователь не авторизован:
 *    - Для Email/Password → signInWithEmailAndPassword
 *    - Для OAuth → signInWithPopup
 *
 * При включённой email enumeration protection метод fetchSignInMethodsForEmail
 * недоступен для определения, какой именно провайдер уже привязан к этому email.
 *
 * Если возникает ошибка "auth/account-exists-with-different-credential":
 *   - Выбрасываем исключение с просьбой ко пользователю авторизоваться
 *     «старым» методом и потом линковать новый.
 * Если возникает ошибка "auth/credential-already-in-use" при линковке:
 *   - Пропускаем линковку и просто возвращаем текущего пользователя,
 *     предполагая, что провайдер уже связан или используется другим аккаунтом.
 *
 * @param auth Экземпляр Auth
 * @param provider Экземпляр OAuth-провайдера (GoogleAuthProvider, GithubAuthProvider)
 *                 или EmailAuthProvider
 * @param emailForPasswordFlow (необязательно) email для входа через Email/Password
 * @param passwordForPasswordFlow (необязательно) пароль для входа через Email/Password
 * @returns {Promise<User>} Возвращает User при успешном входе или линковке
 */
export async function signInOrLinkProvider(
    auth: Auth,
    provider: AuthProvider,
    emailForPasswordFlow?: string,
    passwordForPasswordFlow?: string
): Promise<User> {
    logDebug(
        "signInOrLinkProvider called with provider:",
        provider.constructor.name
    );

    // 1. Если уже есть авторизованный пользователь – link
    if (auth.currentUser) {
        logInfo("Current user detected, linking...");

        // 1.1 EmailAuthProvider
        if (provider instanceof EmailAuthProvider) {
            if (!emailForPasswordFlow || !passwordForPasswordFlow) {
                const errorMsg = `EmailAuthProvider requires both email and password. Received email=${emailForPasswordFlow}, password=${passwordForPasswordFlow}`;
                logError(errorMsg);
                throw new Error(errorMsg);
            }

            try {
                const credential = EmailAuthProvider.credential(
                    emailForPasswordFlow,
                    passwordForPasswordFlow
                );
                const linkResult = await linkWithCredential(
                    auth.currentUser,
                    credential
                );
                logInfo(
                    "Successfully linked EmailAuthProvider to current user:",
                    linkResult.user.uid
                );
                return linkResult.user;
            } catch (linkError) {
                const err = linkError as FirebaseError;
                logError("Error linking EmailAuthProvider:", err);

                if (err.code === "auth/provider-already-linked") {
                    logWarn("Provider already linked, returning current user.");
                    return auth.currentUser;
                }

                throw linkError;
            }
        }

        // 1.2 OAuth (Google/GitHub/etc.)
        try {
            const linkResult = await linkWithPopup(auth.currentUser, provider);
            logInfo(
                "Successfully linked OAuth provider to current user:",
                linkResult.user.uid
            );
            return linkResult.user;
        } catch (oauthLinkError) {
            const err = oauthLinkError as FirebaseError;
            logError("Error linking OAuth provider:", err);

            if (err.code === "auth/credential-already-in-use") {
                logWarn(
                    "Provider already linked or in use, skipping linking step."
                );
                return auth.currentUser;
            }

            throw err;
        }
    }

    // 2. Если пользователь не авторизован – signIn
    logInfo("No current user, performing sign-in...");

    // 2.1 Email/Password
    if (provider instanceof EmailAuthProvider) {
        if (!emailForPasswordFlow || !passwordForPasswordFlow) {
            const errorMsg = `EmailAuthProvider requires both email and password. Received email=${emailForPasswordFlow}, password=${passwordForPasswordFlow}`;
            logError(errorMsg);
            throw new Error(errorMsg);
        }
        try {
            const userCred = await signInWithEmailAndPassword(
                auth,
                emailForPasswordFlow,
                passwordForPasswordFlow
            );
            logInfo("Signed in with Email/Password:", userCred.user.uid);
            return userCred.user;
        } catch (signInError) {
            logError("Error signing in with Email/Password:", signInError);
            throw signInError;
        }
    }

    // 2.2 OAuth-провайдер (Google/GitHub)
    try {
        const signInResult = await signInWithPopup(auth, provider);
        logInfo("Signed in with OAuth provider:", signInResult.user.uid);
        return signInResult.user;
    } catch (error) {
        const firebaseError = error as FirebaseError;
        logError("Error during signInWithPopup:", firebaseError);

        if (
            firebaseError.code ===
            "auth/account-exists-with-different-credential"
        ) {
            const conflictErrorMessage =
                "Аккаунт с таким email уже существует, но используется другой метод входа. " +
                "Пожалуйста, войдите тем методом, которым вы регистрировались ранее (Google, GitHub и т.д.), " +
                "и затем свяжите этот новый провайдер вручную.";
            logWarn("Conflict:", conflictErrorMessage);
            throw new Error(conflictErrorMessage);
        }

        throw error;
    }
}
