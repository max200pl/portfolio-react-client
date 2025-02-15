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
    // const googleLoginHandler = useGoogleLogin({
    //     onSuccess: async (codeResponse) => {
    //         try {
    //             console.log("codeResponse", codeResponse);

    //             const authGooleResponse = await getAuthGoole(
    //                 typeAction,
    //                 codeResponse
    //             );

    //             console.log("authGooleResponse", authGooleResponse);
    //             if (authGooleResponse.user === undefined) {
    //                 throw new Error("User not found");
    //             }
    //             // userCtx.setUserAuthentication(authGooleResponse.user);
    //             navigate("/");
    //         } catch (error: any) {
    //             if (error.response && error.response.data) {
    //                 setError({
    //                     message: error.response.data.message,
    //                 });
    //             } else {
    //                 setError({ message: error.message });
    //             }
    //             console.error("Error during Google authentication:", error);
    //         }
    //     },
    //     onError: (error) => console.log("Login with Goole Failed:", error),
    // });

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
