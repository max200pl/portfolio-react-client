import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GithubLoginButton } from "react-social-login-buttons";
import { TypeActionAuth } from "../../api/auth.api";
import s from "./ButtonAuthGitHub.module.scss";
import { ErrorMessage } from "../../../forms/AuthForm/ErrorMessage";
import { AuthContext } from "../../../context/auth-context";
import { formatFirebaseErrorMessages } from "../../../forms/forms.helpers";
import { logError } from "../../../utils/loggingHelpers";

const ButtonAuthGitHub = ({ typeAction }: { typeAction: TypeActionAuth }) => {
    const authCtx = useContext(AuthContext);
    const navigate = useNavigate();
    const [showError, setError] = useState<{ message: string }>();

    const githubLoginHandler = async () => {
        try {
            await authCtx.signInWithGitHub();
            navigate("/");
        } catch (error) {
            const errorCode = (error as { code: string }).code;
            const errorMessage = formatFirebaseErrorMessages(
                errorCode,
                "github"
            );
            logError("Error logging in with GitHub:", errorMessage);
            setError({ message: errorMessage });
        }
    };

    return (
        <>
            {showError && <ErrorMessage message={showError.message} />}
            <GithubLoginButton
                text="GitHub"
                className={`${s["form_control"]} ${s["form_control__login"]}`}
                onClick={githubLoginHandler}
                align="center"
            />
        </>
    );
};

export default ButtonAuthGitHub;
