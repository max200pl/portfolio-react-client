// https://www.figma.com/file/zDlwMyy0LFHCO4CiXLcK7k/Login-Page-Perfect-UI-(Freebie)-(Community)?type=design&node-id=401%3A4165&mode=dev

import { Button, Chip, Divider } from "@mui/material";
import React from "react";
import ButtonAuthGitHub from "../../../assets/components/ButtonAuthGitHub/ButtonAuthGitHub";
import ButtonAuthGoole from "../../../assets/components/ButtonAuthGoole/ButtonAuthGoole";
import AuthForm from "../../../forms/AuthForm/AuthForm";
import AuthModal from "../AuthModal";
import s from "./AuthSignIn.module.scss";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { emailRegExp } from "../../../assets/helpers/regular-expressions";

export type SubmitSignInFormValues = {
    email: string;
    password: string;
};

const schema = yup.object().shape({
    email: yup
        .string()
        .test(
            "emailOrPhone",
            "Invalid format. Please enter a valid email.",
            (value) => {
                return emailRegExp.test(value ?? ""); // || phonePattern.test(value ?? "");
            }
        )
        .required("Email is required")
        .defined(),
    password: yup
        .string()
        .trim()
        .required("Enter password")
        .min(6, "Password must be at least 6 characters long.")
        .defined(),
});

const AuthSignIn: React.FC = () => {
    const navigate = useNavigate();

    return (
        <AuthModal typeAction={"login"}>
            <ButtonAuthGoole typeAction="login" />
            <ButtonAuthGitHub typeAction="login" />

            <Divider className={s["form_control"]}>
                <Chip label="Or with email and password" size="small" />
            </Divider>

            <AuthForm type={"login"} schema={schema} />

            <Divider className={s["form_control"]} sx={{ mt: "6px" }}>
                <Chip label="Don't have an account?" size="small" />
            </Divider>

            <Button
                className={`${s["form_control"]} ${s["form_control__submit"]}`}
                variant="contained"
                color="success"
                type="submit"
                aria-description="Create your Account"
                onClick={() => navigate("/auth/sign-up")}
            >
                Create your Account
            </Button>
        </AuthModal>
    );
};

export default AuthSignIn;
