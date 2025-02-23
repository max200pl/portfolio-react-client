import { useContext, useState } from "react";
import { GoogleLoginButton } from "react-social-login-buttons";
import { TypeActionAuth } from "../../api/auth.api";
import s from "./ButtonAuthGoole.module.scss";
import { ErrorMessage } from "../../../forms/AuthForm/ErrorMessage";
import { AuthContext } from "../../../context/auth-context";
import { useNavigate } from "react-router-dom";
import { formatFirebaseErrorMessages } from "../../../forms/forms.helpers";

const ButtonAuthGoole = ({ typeAction }: { typeAction: TypeActionAuth }) => {
    const authCtx = useContext(AuthContext);
    const navigate = useNavigate();
    const [showError, setError] = useState<{ message: string }>();

    const googleLoginHandler = async () => {
        try {
            console.log("Google login handler");

            await authCtx.signInWithGoogle();
            navigate("/");
        } catch (error) {
            const errorMessage = (error as Error).message;
            setError({ message: errorMessage });
            console.error("Error logging in with Google:", errorMessage);
        }
    };

    return (
        <>
            {showError && <ErrorMessage message={showError.message} />}

            <GoogleLoginButton
                className={`${s["form_control"]} ${s["form_control__login"]}`}
                onClick={() => googleLoginHandler()}
                text={"Google"}
                align="center"
            />
        </>
    );
};

export default ButtonAuthGoole;
