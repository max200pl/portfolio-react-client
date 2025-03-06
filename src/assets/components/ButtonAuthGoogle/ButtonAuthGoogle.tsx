import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLoginButton } from "react-social-login-buttons";
import { TypeActionAuth } from "../../api/auth.api";
import s from "./ButtonAuthGoogle.module.scss";
import { ErrorMessage } from "../../../forms/AuthForm/ErrorMessage";
import { AuthContext } from "../../../context/auth-context";
import { formatFirebaseErrorMessages } from "../../../forms/forms.helpers";
import { logError } from "../../../utils/loggingHelpers";

const ButtonAuthGoogle = ({ typeAction }: { typeAction: TypeActionAuth }) => {
    const authCtx = useContext(AuthContext);
    const navigate = useNavigate();
    const [showError, setError] = useState<{ message: string }>();

    const googleLoginHandler = async () => {
        try {
            await authCtx.signInWithGoogle();
            navigate("/");
        } catch (error) {
            const errorCode = (error as { code: string }).code;
            const errorMessage = formatFirebaseErrorMessages(
                errorCode,
                "google"
            );
            logError("Error logging in with Google:", errorMessage);
            setError({ message: errorMessage });
        }
    };

    return (
        <>
            {showError && <ErrorMessage message={showError.message} />}
            <GoogleLoginButton
                text="Google"
                className={`${s["form_control"]} ${s["form_control__login"]}`}
                onClick={googleLoginHandler}
                align="center"
            />
        </>
    );
};

export default ButtonAuthGoogle;
