import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Stack, TextField } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import s from "./ModalHireMeForm.module.scss";
import { FC } from "react";
import { sendMessage } from "../../../assets/api/api.message";

export type DataMessage = {
    name: string;
    email: string;
    description: string;
};

const schema = yup.object({
    name: yup.string().required("Please write Name"),
    email: yup
        .string()
        .email("Please write correct email")
        .required("Please write Email"),
    description: yup.string().required("Please write Description"),
});

interface ModalHireMeFormProps {
    onClose: () => void;
}

const ModalHireMeForm: FC<ModalHireMeFormProps> = ({ onClose }) => {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<DataMessage>({
        resolver: yupResolver(schema),
    });

    const onSubmit = (data: DataMessage) => {
        try {
            sendMessage(data);
            onClose();
        } catch (error) {
            console.error("Error deleting work:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={s.form}>
            <Controller
                name="name"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                    <TextField
                        className={s["form_control"]}
                        {...field}
                        variant="outlined"
                        label="Name"
                        size="small"
                        margin="none"
                        error={!!errors.name}
                        helperText={errors?.name?.message}
                        fullWidth
                    />
                )}
            />
            <Controller
                name="email"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                    <TextField
                        className={s["form_control"]}
                        {...field}
                        variant="outlined"
                        label="Email"
                        size="small"
                        margin="none"
                        error={!!errors.email}
                        helperText={errors?.email?.message}
                        fullWidth
                    />
                )}
            />
            <Controller
                name="description"
                control={control}
                render={({ field }) => (
                    <TextField
                        className={s["form_control"]}
                        {...field}
                        variant="outlined"
                        label="Description"
                        size="small"
                        margin="none"
                        error={!!errors.description}
                        helperText={errors?.description?.message}
                        fullWidth
                    />
                )}
            />
            <div className={s.form__footer}>
                <Stack direction="row" spacing={2} justifyContent="flex-end">
                    <Button variant="outlined" onClick={() => onClose()}>
                        Close
                    </Button>
                    <Button
                        className="action_button_primary"
                        variant="contained"
                        type="submit"
                    >
                        Send
                    </Button>
                </Stack>
            </div>
        </form>
    );
};

export default ModalHireMeForm;
