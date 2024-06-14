import { useUserContext, googleSignIn, logOut } from "@/context/userContext";
import { useState } from "react";

const Login = () => {
    const user = useUserContext();

    function handleLogout() {
        logOut();
    }

    function handleGoogleLogin() {
        googleSignIn();
    }

    return (
        <div>
            <p>
                Login.tsx
            </p>
        </div>
    )
}

export default Login;