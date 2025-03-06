import React, { useContext } from "react";
import { AuthContext } from "../context/auth-context";

const ButtonAuthGoogle: React.FC = () => {
    const { signInWithGoogle } = useContext(AuthContext);

    const googleLoginHandler = async () => {
        try {
            await signInWithGoogle();
        } catch (error) {
            console.error("Error logging in with Google:", error);
        }
    };

    return <button onClick={googleLoginHandler}>Sign in with Google</button>;
};

export default ButtonAuthGoogle;
