import { useContext, useState } from "react";
import { GoogleLoginButton } from "react-social-login-buttons";
import { TypeActionAuth } from "../../api/auth.api";
import s from "./ButtonAuthGoole.module.scss";
import { ErrorMessage } from "../../../forms/AuthForm/ErrorMessage";
import { AuthContext } from "../../../context/auth-context";

const ButtonAuthGoole = ({ typeAction }: { typeAction: TypeActionAuth }) => {
    const authCtx = useContext(AuthContext);
    const [showError] = useState<{ message: "string" }>();

    const googleLoginHandler = () => {
        console.log("Google login handler");

        authCtx.signInWithGoogle();
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
