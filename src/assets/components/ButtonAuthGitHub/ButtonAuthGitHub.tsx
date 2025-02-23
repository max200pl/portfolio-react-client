import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GithubLoginButton } from "react-social-login-buttons";
import { TypeActionAuth } from "../../api/auth.api";
import s from "./ButtonAuthGitHub.module.scss";
import { ErrorMessage } from "../../../forms/AuthForm/ErrorMessage";
import { SetStateAction } from "../../interfaces/interfaces.helpers";
import { AuthContext } from "../../../context/auth-context";

const ButtonAuthGitHub = ({ typeAction }: { typeAction: TypeActionAuth }) => {
    const authCtx = useContext(AuthContext);
    const navigate = useNavigate();
    const [showError, setError] = useState<{ message: "string" }>();

    const githubLoginHandler = async () => {
        try {
            await authCtx.signInWithGitHub();
            navigate("/");
        } catch (error) {
            const { response } = error as {
                response: { data: { message: string } };
            };
            setError(
                response.data as SetStateAction<
                    { message: "string" } | undefined
                >
            );
            console.log(error);
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
