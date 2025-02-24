type EmailOrPhone = string;
type ValidationResult =
    | "This is a valid email."
    | "This is a valid phone number."
    | "Invalid format. Please enter a valid email or phone number.";

export function isValidEmailOrPhone(
    emailOrPhone: EmailOrPhone
): ValidationResult {
    const emailPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern: RegExp = /^\d{10}$/;

    if (emailPattern.test(emailOrPhone)) {
        return "This is a valid email.";
    } else if (phonePattern.test(emailOrPhone)) {
        return "This is a valid phone number.";
    } else {
        return "Invalid format. Please enter a valid email or phone number.";
    }
}

export const formatFirebaseErrorMessages = (
    errorCode: string,
    action: string
): string => {
    let message = "";

    if (action === "signup") {
        if (
            errorCode === "auth/invalid-email" ||
            errorCode === "auth/missing-email"
        ) {
            message = "Invalid email address.";
        } else if (
            errorCode === "auth/missing-password" ||
            errorCode === "auth/weak-password"
        ) {
            message = "Password must be at least 6 characters long.";
        } else if (errorCode === "auth/email-already-in-use") {
            message = "Email already in use.";
        }
    } else if (action === "login") {
        if (
            errorCode === "auth/invalid-email" ||
            errorCode === "auth/missing-email"
        ) {
            message = "Incorrect email.";
        } else if (
            errorCode === "auth/missing-password" ||
            errorCode === "auth/wrong-password"
        ) {
            message = "Incorrect password.";
        } else if (
            errorCode === "auth/user-not-found" ||
            errorCode === "auth/invalid-credential"
        ) {
            message = "Account not found.";
        }
    } else if (action === "github" || action === "google") {
        if (errorCode === "auth/account-exists-with-different-credential") {
            message = "Account exists with different credentials.";
        }
    }

    return message;
};
