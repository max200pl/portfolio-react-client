import { yupResolver } from "@hookform/resolvers/yup";
import {
    Button,
    Checkbox,
    FormControlLabel,
    Stack,
    TextField,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { FC, useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import AutocompleteTagsCheckboxes, {
    CheckboxesTagsOptions,
} from "../../../assets/components/AutocompleteTagsCheckboxesMUI/AutocompleteTagsCheckboxesMUI";
import SelectMUI from "../../../assets/components/SelectMUI/SelectMUI";
import {
    ICertificate,
    InterfaceTechWithApply,
} from "../../../assets/interfaces/interfaces";
import {
    getOptionsGroupAutocomplete,
    prepareTech,
} from "./ModalCertificateManagerForm.helpers";
import DeleteIcon from "@mui/icons-material/Delete";
import dayjs from "dayjs";
import {
    TypeActionForm,
    SaveCertificate,
    useCreateCertificateMutation,
    useDeleteCertificateMutation,
    useGetTechnologiesCertificatesQuery,
    useUpdateCertificatesMutation as useUpdateCertificateMutation,
} from "../../../assets/api/certificates.api";
import ImageFileUpload from "../../../assets/components/ImageFileUpload/ImageFileUpload";
import { getFolderName, getImageName } from "../../../assets/helpers/helpers";

import s from "./ModalCertificateManagerForm.module.scss";
import { getDirtyFields } from "../../../assets/helpers/reactHookForm.helpers";
import { defUrlCertificateImage } from "../../../assets/api/constants";

export type IFormInput = {
    frontTech: CheckboxesTagsOptions | [];
    backTech: CheckboxesTagsOptions | [];
    _id?: string;
    name: string;
    dateFinished?: Date;
    category: string;
    client?: string;
    link?: string;
    image: any;
};

export type KeysIFormInput = keyof IFormInput;

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
    frontTech: yup
        .array()
        .required()
        .of(
            yup.object({
                group: yup.string().required(),
                value: yup.string().required(),
            })
        ),
    backTech: yup
        .array()
        .required()
        .of(
            yup.object({
                group: yup.string().required(),
                value: yup.string().required(),
            })
        ),
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
    const [showFrontTech, setShowFrontTech] = useState(false);
    const [showBackTech, setShowBackTech] = useState(false);

    const { mutate: createCertificate } = useCreateCertificateMutation();
    const { mutate: updateCertificate } = useUpdateCertificateMutation();
    const { mutate: deleteCertificate } = useDeleteCertificateMutation();

    const [urlImage, setUrlImage] = useState<string | undefined>();
    const { data: technologies, status: statusTechnologies } =
        useGetTechnologiesCertificatesQuery();

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

    useEffect(() => {
        if (statusTechnologies === "success") {
            setShowFrontTech(certificate?.frontTech.length > 0);
            setShowBackTech(certificate?.backTech.length > 0);
        }
    }, [
        statusTechnologies,
        certificate?.backTech.length,
        certificate?.frontTech.length,
    ]);

    const {
        control,
        handleSubmit,
        setValue,
        clearErrors,
        formState: { errors, dirtyFields },
    } = useForm<IFormInput>({
        mode: "onBlur",
        resolver: yupResolver(schema),
        defaultValues: {
            image: undefined,
            name: certificate?.name ?? undefined,
            link: certificate?.link ?? undefined,
            category: certificate?.category ?? undefined,
            client: certificate?.client ?? undefined,
            dateFinished: certificate?.dateFinished
                ? certificate.dateFinished
                : undefined,
            frontTech: certificate?.frontTech
                ? getOptionsGroupAutocomplete(certificate.frontTech)
                : [],
            backTech: certificate?.backTech
                ? getOptionsGroupAutocomplete(certificate.backTech)
                : [],
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

    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        try {
            let result;

            if (typeActionForm === "create") {
                result = await createCertificate({
                    ...data,
                    frontTech: prepareTech(data.frontTech),
                    backTech: prepareTech(data.backTech),
                } as SaveCertificate);
            }

            if (typeActionForm === "update") {
                const dataForm: IFormInput = data;
                const dirtyFieldsForm: DirtyFields<IFormInput> = dirtyFields;

                const updatedFields: Partial<IFormInput> = getDirtyFields<
                    Partial<IFormInput>
                >(dataForm, dirtyFieldsForm);

                const prepareBackTech =
                    updatedFields.backTech !== undefined
                        ? {
                              backTech: prepareTech(
                                  updatedFields.backTech as CheckboxesTagsOptions
                              ),
                          }
                        : {};
                const prepareFrontTech =
                    updatedFields.frontTech !== undefined
                        ? {
                              frontTech: prepareTech(
                                  updatedFields.frontTech as CheckboxesTagsOptions
                              ),
                          }
                        : {};

                result = await updateCertificate({
                    _id: certificate._id,
                    name: updatedFields.name ?? certificate.name,
                    ...updatedFields,
                    ...(prepareBackTech as {
                        backTech: InterfaceTechWithApply[];
                    }),
                    ...(prepareFrontTech as {
                        frontTech: InterfaceTechWithApply[];
                    }),
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
                <ImageFileUpload
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
                            options={[
                                "Certificate of Completion", // – Сертификат о прохождении курса или обучения.
                                "Diploma", // – Диплом, выданный образовательным учреждением, обычно после окончания учебной программы.
                                "Certification", // – Сертификат, подтверждающий профессиональную квалификацию или успешное прохождение экзамена.
                                "Award Certificate", // – Сертификат награды, выдаваемый за достижения или победы в конкурсах.
                                "Professional License", // – Лицензия, подтверждающая право на профессиональную деятельность (например, в медицине или юриспруденции).
                                "Certification of Participation", // – Сертификат участия в мероприятии или конференции.
                                "Honorary Diploma", // – Сертификат за достижение определённых результатов или выполнение целей.
                                "Training Certificate", // – Сертификат об окончании тренинга или курса.
                                "Certificate of Achievement", // – Сертификат достижений, выдаваемый за успешное выполнение определённых задач или проектов.
                            ]}
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

                {(typeActionForm === "create" ||
                    certificate?.frontTech.length === 0) && (
                    <FormControlLabel
                        control={
                            <Checkbox
                                onChange={() =>
                                    setShowFrontTech(!showFrontTech)
                                }
                            />
                        }
                        label={
                            certificate?.frontTech.length === 0
                                ? "Do you want add frontend technologies?"
                                : "Did you use frontend technologies?"
                        }
                    />
                )}

                {showFrontTech && statusTechnologies === "success" && (
                    <AutocompleteTagsCheckboxes
                        className={s["form_control"]}
                        control={control}
                        name={"frontTech"}
                        options={getOptionsGroupAutocomplete(
                            technologies?.frontend
                        )}
                        label="Frontend Technologies"
                        placeholder="Add Technology"
                    />
                )}

                {(typeActionForm === "create" ||
                    certificate?.backTech.length === 0) && (
                    <FormControlLabel
                        control={
                            <Checkbox
                                onChange={() => setShowBackTech(!showBackTech)}
                            />
                        }
                        label={
                            certificate?.frontTech.length === 0
                                ? "Do you want add backend technologies?"
                                : "Did you use backend technologies?"
                        }
                    />
                )}

                {showBackTech && statusTechnologies === "success" && (
                    <AutocompleteTagsCheckboxes
                        className={s["form_control"]}
                        control={control}
                        name="backTech"
                        options={getOptionsGroupAutocomplete(
                            technologies?.backend
                        )}
                        label="Backend Technologies"
                        placeholder="Add Technology"
                    />
                )}
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
