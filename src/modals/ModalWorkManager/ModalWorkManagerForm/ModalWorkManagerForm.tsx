import { yupResolver } from "@hookform/resolvers/yup";
import {
    Button,
    Checkbox,
    FormControlLabel,
    Stack,
    TextField,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { FC, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import AutocompleteTagsCheckboxes, {
    CheckboxesTagsOptions,
} from "../../../assets/components/AutocompleteTagsCheckboxesMUI/AutocompleteTagsCheckboxesMUI";
import SelectMUI from "../../../assets/components/SelectMUI/SelectMUI";
import {
    getOptionsGroupAutocomplete,
    prepareTech,
    prepareTechForOptionsAutocomplete,
} from "./ModalWorkManagerForm.helpers";
import DeleteIcon from "@mui/icons-material/Delete";
import dayjs from "dayjs";
import {
    TypeActionForm,
    useCreateWorkMutation,
    useGetTechnologiesQuery,
    useUpdateWorkMutation,
    useDeleteWorkMutation,
    useGetCategoriesWorksQuery,
    SaveWork,
} from "../../../assets/api/works.api";
import ImageFileUpload from "../../../assets/components/ImageFileUpload/ImageFileUpload";

import s from "./ModalWorkManagerForm.module.scss";
import { getDirtyFields } from "../../../assets/helpers/reactHookForm.helpers";
import { Category, IWork } from "../../../assets/interfaces/NewInterfaces";

export type WorkFormData = {
    frontTech?: CheckboxesTagsOptions;
    backTech?: CheckboxesTagsOptions;
    _id?: string;
    name: string;
    dateFinished?: Date;
    category: Category["_id"];
    client?: string;
    link?: string;
    image: any;
};

export type KeysIFormInput = keyof WorkFormData;

const schema = yup.object({
    name: yup
        .string()
        .matches(/[^\d]/, "Field cannot consist only of digits")
        .required("Please write Name Project"),
    client: yup.string(),
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
    frontTech: yup.array().of(
        yup.object({
            group: yup.string().required(),
            value: yup.string().required(),
        })
    ),
    backTech: yup.array().of(
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
    onClose: () => void;
    work: IWork;
}

const ModalWorkManagerForm: FC<Props> = ({ onClose, work }) => {
    const [typeActionForm] = useState<TypeActionForm>(
        work === undefined ? "create" : "update"
    );

    console.log("===== ModalWorkManagerForm =====");
    console.log("work", work);

    const [showFrontTech, setShowFrontTech] = useState(() =>
        Boolean(work?.frontTech && Object.keys(work?.frontTech).length)
    );

    const [showBackTech, setShowBackTech] = useState(() =>
        Boolean(work?.backTech && Object.keys(work?.backTech).length)
    );

    const [urlImage] = useState<string | undefined>(work?.cardImage?.url);

    const { mutate: createWork } = useCreateWorkMutation();
    const { mutate: updateWork } = useUpdateWorkMutation();
    const { mutate: deleteWork } = useDeleteWorkMutation();

    const { data: technologies, status: statusTechnologies } =
        useGetTechnologiesQuery();

    const { data: categories } = useGetCategoriesWorksQuery();

    const {
        control,
        handleSubmit,
        setValue,
        clearErrors,
        formState: { errors, dirtyFields },
    } = useForm<WorkFormData>({
        mode: "onBlur",
        resolver: yupResolver(schema),
        defaultValues: {
            image: undefined,
            name: work?.name,
            link: work?.link,
            category: work?.category.label,
            client: work?.client,
            dateFinished: work?.dateFinished,
            frontTech: getOptionsGroupAutocomplete(work?.frontTech),
            backTech: getOptionsGroupAutocomplete(work?.backTech),
        },
    });

    const onDelete = () => {
        console.log(work, " onDelete work._id");
        try {
            const result = deleteWork(work._id);
            console.log("Work was deleted successfully", result);
            onClose();
        } catch (error) {
            console.error("Error deleting work:", error);
        }
    };

    const onSubmit: SubmitHandler<WorkFormData> = async (data) => {
        try {
            let result;
            const dataForm: WorkFormData = data;
            const dirtyFieldsForm: DirtyFields<WorkFormData> = dirtyFields;
            const updatedFields: Partial<WorkFormData> = getDirtyFields<
                Partial<WorkFormData>
            >(dataForm, dirtyFieldsForm);

            console.log("dataForm", dataForm);
            console.log("dirtyFieldsForm", dirtyFieldsForm);

            if (updatedFields.category !== undefined) {
                updatedFields.category = categories?.find(
                    (category) => category.label === updatedFields.category
                )?._id;
            }

            if (updatedFields.image === undefined) {
                delete updatedFields.image;
            }

            const prepareFrontTech =
                updatedFields.frontTech !== undefined
                    ? {
                          frontTech: prepareTech(updatedFields.frontTech),
                      }
                    : {};
            const prepareBackTech =
                updatedFields.backTech !== undefined
                    ? {
                          backTech: prepareTech(updatedFields.backTech),
                      }
                    : {};
            // console.log("updatedFields", updatedFields);

            // console.log("prepareFrontTech", prepareFrontTech);
            // console.log("prepareBackTech", prepareBackTech);
            if (typeActionForm === "create") {
                result = await createWork({
                    ...updatedFields,
                    ...prepareBackTech,
                    ...prepareFrontTech,
                } as SaveWork);
            }

            if (typeActionForm === "update") {
                result = await updateWork({
                    _id: work._id,
                    name: updatedFields.name ?? work.name,
                    ...updatedFields,
                    ...prepareBackTech,
                    ...prepareFrontTech,
                } as Partial<SaveWork>);
            }

            console.log("Work created successfully", result);
            onClose();
        } catch (error) {
            console.error("Error creating work:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={s.form}>
            <div className={s.form__header}>
                <ImageFileUpload<WorkFormData>
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
                    name="client"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                        <TextField
                            className={s["form_control"]}
                            {...field}
                            variant="outlined"
                            label="Client"
                            size="small"
                            margin="none"
                            fullWidth
                            error={!!errors.client}
                            helperText={errors?.client?.message}
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
                            options={
                                categories?.map((category) => category.label) ||
                                []
                            }
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
                            label="Link"
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
                    Object.keys(work?.frontTech || {}).length === 0) && (
                    <FormControlLabel
                        control={
                            <Checkbox
                                onChange={() =>
                                    setShowFrontTech(!showFrontTech)
                                }
                            />
                        }
                        label={
                            Object.keys(work?.frontTech || {}).length === 0
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
                        options={prepareTechForOptionsAutocomplete(
                            technologies?.frontend
                        )}
                        label="Frontend Technologies"
                        placeholder="Add Technology"
                    />
                )}

                {(typeActionForm === "create" ||
                    Object.keys(work?.backTech || {}).length === 0) && (
                    <FormControlLabel
                        control={
                            <Checkbox
                                onChange={() => setShowBackTech(!showBackTech)}
                            />
                        }
                        label={
                            Object.keys(work?.backTech || {}).length === 0
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
                        options={prepareTechForOptionsAutocomplete(
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

export default ModalWorkManagerForm;
