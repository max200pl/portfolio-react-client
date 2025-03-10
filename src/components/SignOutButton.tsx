import React, { useContext } from "react";
import { AuthContext } from "../context/auth-context";
import { useNavigate } from "react-router-dom";

const SignOutButton: React.FC = () => {
    const navigate = useNavigate();
    const { signOut } = useContext(AuthContext);

    const handleSignOut = async () => {
        try {
            await signOut();
            alert("Successfully signed out.");
            navigate("/");
        } catch (error) {
            console.error("Error signing out:", error);
            alert("Error signing out. Please try again.");
        }
    };

    return <button onClick={handleSignOut}>Sign Out</button>;
};

export default SignOutButton;
