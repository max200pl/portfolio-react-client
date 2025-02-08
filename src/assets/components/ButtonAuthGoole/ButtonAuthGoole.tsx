import { useGoogleLogin } from "@react-oauth/google";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLoginButton } from "react-social-login-buttons";
import { UserContext } from "../../../context/user-context";
import { getAuthGoole, TypeActionAuth } from "../../api/auth.api";
import s from "./ButtonAuthGoole.module.scss";
import { ErrorMessage } from "../../../forms/AuthForm/ErrorMessage";

const ButtonAuthGoole = ({ typeAction }: { typeAction: TypeActionAuth }) => {
    const navigate = useNavigate();
    const userCtx = useContext(UserContext);
    const [showError, setError] = useState<{ message: "string" }>();

    console.log(process.env.REACT_APP_MODE, "process.env.REACT_APP_MODE");
    const googleLoginHandler = useGoogleLogin({
        onSuccess: async (codeResponse) => {
            try {
                console.log("codeResponse", codeResponse);

                const authGooleResponse = await getAuthGoole(
                    typeAction,
                    codeResponse
                );

                console.log("authGooleResponse", authGooleResponse);
                if (authGooleResponse.user === undefined) {
                    throw new Error("User not found");
                }
                userCtx.authUser(authGooleResponse.user);
                navigate("/");
            } catch (error: any) {
                if (error.response && error.response.data) {
                    setError({
                        message: error.response.data.message,
                    });
                } else {
                    setError({ message: error.message });
                }
                console.error("Error during Google authentication:", error);
            }
        },
        onError: (error) => console.log("Login with Goole Failed:", error),
    });

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
