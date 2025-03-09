import React, { useContext } from "react";
import { AuthContext } from "../context/auth-context";

const SignOutButton: React.FC = () => {
    const { signOut } = useContext(AuthContext);

    const handleSignOut = async () => {
        try {
            await signOut();
            alert("Successfully signed out.");
        } catch (error) {
            console.error("Error signing out:", error);
            alert("Error signing out. Please try again.");
        }
    };

    return <button onClick={handleSignOut}>Sign Out</button>;
};

export default SignOutButton;
