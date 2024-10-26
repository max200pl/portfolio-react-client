import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Stack, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { FC, useEffect, useMemo, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import SelectMUI from "../../../assets/components/SelectMUI/SelectMUI";
import { ICertificate } from "../../../assets/interfaces/interfaces";
import DeleteIcon from "@mui/icons-material/Delete";
import dayjs from "dayjs";
import {
    SaveCertificate,
    TypeActionForm,
    useCreateCertificateMutation,
    useDeleteCertificateMutation,
    useGetCategoriesCertificatesQuery,
    useUpdateCertificatesMutation as useUpdateCertificateMutation,
} from "../../../assets/api/certificates.api";
import { defUrlCertificateImage } from "../../../assets/api/constants";
import ImageFileUpload from "../../../assets/components/ImageFileUpload/ImageFileUpload";
import { getFolderName, getImageName } from "../../../assets/helpers/helpers";
import { getDirtyFields } from "../../../assets/helpers/reactHookForm.helpers";
import s from "./ModalCertificateManagerForm.module.scss";

export type CertificateFormData = {
    _id?: string;
    name: string;
    dateFinished?: Date;
    category: string;
    link?: string;
    image: any;
};

export type CertificateFormInputKeys = keyof CertificateFormData;

const schema = yup.object({
    name: yup
        .string()
        .matches(/[^\d]/, "Field cannot consist only of digits")
        .required("Please write Name Project"),
    category: yup.string().required("Please write Name Project"),
    dateFinished: yup.date(),
    link: yup.string(),
    image: yup
        .mixed()
        .required("Please upload an image")
        .test("fileType", "Please upload a valid image", (value) => {
            if (!value) return false;
            if (value instanceof File) {
                return value.type.startsWith("image/");
            } else if (typeof value === "string" && value.startsWith("http")) {
                return true;
            }
            return false;
        }),
});

type DirtyFields<T> = Partial<
    Readonly<{
        [K in keyof T]?: boolean | [] | { group?: boolean; value?: boolean }[];
    }>
>;

interface Props {
    onClose: () => {};
    certificate: ICertificate;
}

const ModalCertificateManagerForm: FC<Props> = ({ onClose, certificate }) => {
    const [typeActionForm] = useState<TypeActionForm>(
        certificate === undefined ? "create" : "update"
    );
    const { mutate: createCertificate } = useCreateCertificateMutation();
    const { mutate: updateCertificate } = useUpdateCertificateMutation();
    const { mutate: deleteCertificate } = useDeleteCertificateMutation();
    const { data: categories = [] } = useGetCategoriesCertificatesQuery();

    const [urlImage, setUrlImage] = useState<string | undefined>();

    const categoriesOptions = useMemo(
        () => categories.map((category) => category.type_name),
        [categories]
    );

    useEffect(() => {
        if (
            typeActionForm === "update" &&
            certificate?.cardImage !== undefined
        ) {
            const nameCardImage = certificate.cardImage.name;
            const name = getImageName(nameCardImage);
            const project = getFolderName(nameCardImage);

            setUrlImage(defUrlCertificateImage(project, name));
        }
    }, [typeActionForm, certificate]);

    const {
        control,
        handleSubmit,
        setValue,
        clearErrors,
        formState: { errors, dirtyFields },
    } = useForm<CertificateFormData>({
        mode: "onBlur",
        resolver: yupResolver(schema),
        defaultValues: {
            _id: certificate?._id ?? undefined,
            image: undefined,
            name: certificate?.name ?? undefined,
            link: certificate?.link ?? undefined,
            category: certificate?.category ?? undefined,
            dateFinished: certificate?.dateFinished
                ? certificate.dateFinished
                : undefined,
        },
    });

    const onDelete = () => {
        console.log(certificate, " onDelete certificate._id");
        try {
            const result = deleteCertificate(certificate._id);
            console.log("Certificate was deleted successfully", result);
            onClose();
        } catch (error) {
            console.error("Error deleting certificate:", error);
        }
    };

    const onSubmit: SubmitHandler<CertificateFormData> = async (data) => {
        try {
            let result;

            if (typeActionForm === "create") {
                result = await createCertificate({
                    ...data,
                } as SaveCertificate);
            }

            if (typeActionForm === "update") {
                const dataForm: CertificateFormData = data;
                const dirtyFieldsForm: DirtyFields<CertificateFormData> =
                    dirtyFields;

                const updatedFields: Partial<CertificateFormData> =
                    getDirtyFields<Partial<CertificateFormData>>(
                        dataForm,
                        dirtyFieldsForm
                    );

                result = await updateCertificate({
                    _id: certificate._id,
                    name: updatedFields.name ?? certificate.name,
                    ...updatedFields,
                } as Partial<SaveCertificate>);
            }
            console.log("Certificate created successfully", result);
        } catch (error) {
            console.error("Error creating certificate:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={s.form}>
            <div className={s.form__header}>
                <ImageFileUpload<CertificateFormData>
                    clearErrors={clearErrors}
                    errors={errors}
                    setValue={setValue}
                    urlImage={urlImage}
                />
            </div>

            <div className={s.form__content + " custom_scroll"}>
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
                    name="category"
                    control={control}
                    render={({ field }) => (
                        <SelectMUI
                            margin="none"
                            className={s["form_control"]}
                            label="Category"
                            value={field.value}
                            name={field.name}
                            size="small"
                            options={categoriesOptions}
                            onChange={(e) => field.onChange(e.target.value)}
                            errors={errors.category}
                        />
                    )}
                />

                <Controller
                    name="link"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                        <TextField
                            className={s["form_control"]}
                            {...field}
                            variant="outlined"
                            label="Link to credential"
                            size="small"
                            margin="none"
                            fullWidth
                            error={!!errors.link}
                            helperText={errors?.link?.message}
                        />
                    )}
                />

                <Controller
                    name="dateFinished"
                    control={control}
                    render={({ field }) => (
                        <DatePicker
                            value={field.value ? dayjs(field.value) : undefined}
                            slotProps={{ textField: { size: "small" } }}
                            className={s["form_control"]}
                            label="Finished date"
                            onChange={(date) => field.onChange(date)}
                        />
                    )}
                />
            </div>

            <div className={s.form__footer}>
                <Stack
                    direction="row"
                    spacing={2}
                    justifyContent="space-between"
                >
                    <div>
                        {typeActionForm === "update" && (
                            <Button
                                className="action_button_primary"
                                variant="contained"
                                startIcon={<DeleteIcon />}
                                onClick={() => onDelete()}
                            >
                                Delete
                            </Button>
                        )}
                    </div>

                    <Stack direction="row" spacing={2}>
                        <Button variant="outlined" onClick={() => onClose()}>
                            Close
                        </Button>
                        <Button
                            className="action_button_primary"
                            variant="contained"
                            type="submit"
                        >
                            Save
                        </Button>
                    </Stack>
                </Stack>
            </div>
        </form>
    );
};

export default ModalCertificateManagerForm;
