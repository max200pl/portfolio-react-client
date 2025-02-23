import { useContext, useState } from "react";
import { GoogleLoginButton } from "react-social-login-buttons";
import { TypeActionAuth } from "../../api/auth.api";
import s from "./ButtonAuthGoole.module.scss";
import { ErrorMessage } from "../../../forms/AuthForm/ErrorMessage";
import { AuthContext } from "../../../context/auth-context";
import { Navigate, useNavigate } from "react-router-dom";

const ButtonAuthGoole = ({ typeAction }: { typeAction: TypeActionAuth }) => {
    const authCtx = useContext(AuthContext);
    const navigate = useNavigate();
    const [showError] = useState<{ message: "string" }>();

    const googleLoginHandler = async () => {
        try {
            console.log("Google login handler");

            await authCtx.signInWithGoogle();
            navigate("/");
        } catch (error) {
            const { response } = error as {
                response: { data: { message: string } };
            };
            console.log(response.data);
            console.log(error);
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
