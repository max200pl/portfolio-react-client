// https://www.figma.com/file/zDlwMyy0LFHCO4CiXLcK7k/Login-Page-Perfect-UI-(Freebie)-(Community)?type=design&node-id=401%3A4165&mode=dev

import { yupResolver } from "@hookform/resolvers/yup";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
    Button,
    FormControl,
    FormHelperText,
    IconButton,
    InputAdornment,
    InputLabel,
    Link,
    OutlinedInput,
    Stack,
    TextField,
} from "@mui/material";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { TypeActionAuth } from "../../assets/api/auth.api";
import s from "./AuthForm.module.scss";
import { SubmitSignInFormValues } from "../../pages/Auth/AuthSignIn/AuthSignIn";
import { AnyObject, Maybe, ObjectSchema } from "yup";
import { SubmitSignUpFormValues } from "../../pages/Auth/AuthSignUp/AuthSignUp";
import { ErrorMessage } from "./ErrorMessage";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/auth-context";
import { formatFirebaseErrorMessages } from "../../forms/forms.helpers";
import { log, logError } from "../../utils/logger";

interface AuthFormProps<T extends Maybe<AnyObject>> {
    type: TypeActionAuth;
    schema: ObjectSchema<T>;
    defaultValues?: any;
}

const AuthForm = <T extends SubmitSignUpFormValues | SubmitSignInFormValues>({
    type,
    schema,
    defaultValues,
}: AuthFormProps<T>) => {
    const navigate = useNavigate();
    const authCtx = useContext(AuthContext);
    const [showPassword, setShowPassword] = useState(false);
    const [showError, setError] = useState<{ message: string } | undefined>();

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        mode: "onSubmit",
        resolver: yupResolver(schema),
        defaultValues: defaultValues || {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
        },
    });

    const onSubmit: SubmitHandler<
        SubmitSignUpFormValues | SubmitSignInFormValues
    > = async (data) => {
        log("🚨 Submitting form with data:", data);

        try {
            if (type === "sign-up") {
                await authCtx.signUpWithForm(data as SubmitSignUpFormValues);
                log("User signed up successfully", data);
            } else if (type === "login") {
                await authCtx.signInWithForm(data as SubmitSignInFormValues);
                log("User signed in successfully", data);
            }
            setError(undefined);
            navigate("/");
        } catch (error) {
            console.error("Error signing in with form:", error);
            const errorCode = (error as { code: string }).code;
            const errorMessage = formatFirebaseErrorMessages(
                errorCode,
                type === "sign-up" ? "signup" : "login"
            );
            logError(
                `Error ${
                    type === "sign-up" ? "signing up" : "signing in"
                } with Form:`,
                errorMessage
            );

            setError({ message: errorMessage });
        }
    };

    return (
        <form
            onSubmit={(e) => {
                console.log("🚨 Form submitted!");
                handleSubmit(onSubmit)(e);
            }}
            className={s.form}
        >
            {showError && <ErrorMessage message={showError.message} />}
            {type === "sign-up" && (
                <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    justifyContent="space-between"
                    className={s["form_control"]}
                >
                    <Controller
                        name="firstName"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                variant="outlined"
                                label="First Name"
                                size="small"
                                margin="none"
                                error={!!errors.firstName}
                                helperText={<>{errors?.firstName?.message}</>}
                                fullWidth
                            />
                        )}
                    />
                    <Controller
                        name="lastName"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                variant="outlined"
                                label="Last Name"
                                size="small"
                                margin="none"
                                error={!!errors.lastName}
                                helperText={<>{errors?.lastName?.message}</>}
                                fullWidth
                            />
                        )}
                    />
                </Stack>
            )}

            <Controller
                name="email"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                    <TextField
                        {...field}
                        variant="outlined"
                        label="Email"
                        className={s["form_control"]}
                        size="small"
                        margin="none"
                        error={!!errors.email}
                        helperText={<>{errors?.email?.message}</>}
                        fullWidth
                    />
                )}
            />
            <Controller
                name="password"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                    <FormControl
                        variant="outlined"
                        className={s["form_control"]}
                        size="small"
                        margin="none"
                    >
                        <InputLabel htmlFor="password">Password</InputLabel>
                        <OutlinedInput
                            id="password"
                            label="Password"
                            {...field}
                            type={showPassword ? "text" : "password"}
                            error={!!errors.password}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() =>
                                            setShowPassword((show) => !show)
                                        }
                                        edge="end"
                                    >
                                        {showPassword ? (
                                            <VisibilityOff />
                                        ) : (
                                            <Visibility />
                                        )}
                                    </IconButton>
                                </InputAdornment>
                            }
                        />

                        {errors?.password?.message && (
                            <FormHelperText error id="accountId-error">
                                <>{errors?.password?.message}</>
                            </FormHelperText>
                        )}
                    </FormControl>
                )}
            />
            {type === "login" && (
                <Stack
                    className={s["form_control"]}
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    justifyContent=" end"
                >
                    <Link
                        href="#"
                        underline="hover"
                        color="inherit"
                        sx={{ width: "max-content" }}
                    >
                        Forgot password?
                    </Link>
                </Stack>
            )}

            <Button
                className={`${s["form_control"]} ${s["form_control__submit"]}`}
                variant="contained"
                type="submit"
            >
                {type === "sign-up" ? "Sign Up" : "Sign in"}
            </Button>
        </form>
    );
};

export default AuthForm;
