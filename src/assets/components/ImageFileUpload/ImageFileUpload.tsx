// https://spacejelly.dev/posts/uploading-files-in-react-from-a-form-with-drag-and-drop/

import { FC, useCallback, useEffect, useState } from "react";
import s from "./ImageFileUpload.module.scss";
import ImageLazyLoad from "../ImageLazyLoad/ImageLazyLoad";
import { useDropzone } from "react-dropzone";
import ImgFileUpload from "../../images/upload_image.svg";
import ImageChangeFileUpload from "../../images/change_upload.svg";

import { ReactComponent as ImageDeleted } from "../../images/delete.svg";
import {
    FieldErrors,
    FieldValues,
    Path,
    PathValue,
    UseFormClearErrors,
    UseFormSetValue,
} from "react-hook-form";

type Props<T extends FieldValues> = {
    urlImage: string | undefined;
    setValue: UseFormSetValue<T>;
    errors: FieldErrors<T> | undefined;
    clearErrors: UseFormClearErrors<T>;
};

const ImageFileUpload = <T extends FieldValues>({
    clearErrors,
    urlImage,
    setValue,
    errors,
}: Props<T>) => {
    const [preview, setPreview] = useState<string | ArrayBuffer | null>(null);

    useEffect(() => {
        if (urlImage !== undefined) {
            setPreview(urlImage);
            setValue("image" as Path<T>, urlImage as PathValue<T, Path<T>>, {
                shouldDirty: false,
            });
        }
    }, [setValue, urlImage]);

    const onDrop = useCallback(
        (acceptedFiles: Array<File>) => {
            const file = new FileReader();
            file.onload = () => {
                setPreview(file.result);
            };
            file.readAsDataURL(acceptedFiles[0]);

            setValue(
                "image" as Path<T>,
                acceptedFiles[0] as PathValue<T, Path<T>>,
                { shouldDirty: true }
            );
            clearErrors(["image"] as Path<T>[]);
        },
        [clearErrors, setValue]
    );

    function handleOnChange(e: React.FormEvent<HTMLInputElement>) {
        const target = e.target as HTMLInputElement & { files: FileList };
        const file = new FileReader();

        file.onload = () => {
            setPreview(file.result);
        };

        setValue("image" as Path<T>, target.files[0] as PathValue<T, Path<T>>, {
            shouldDirty: true,
        });
        clearErrors(["image"] as Path<T>[]);
    }

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
    });
    const helperText = errors?.image?.message as string | undefined;

    return (
        <div
            error-state={String(!!errors?.image)}
            className={s.container}
            {...getRootProps()}
        >
            <input
                {...getInputProps()}
                onInput={handleOnChange}
                onChange={handleOnChange}
                className="file-input"
                type="file"
                name="image"
                accept="image/*"
            />

            {preview && (
                <>
                    <ImageLazyLoad url={preview as string} />
                    <img
                        className={s.image_change_upload}
                        src={ImageChangeFileUpload}
                        alt="change upload"
                    />
                    <ImageDeleted
                        className={s.image_deleted}
                        onClick={(e) => {
                            e.stopPropagation();
                            setPreview(null);
                            setValue(
                                "image" as Path<T>,
                                undefined as PathValue<T, Path<T>>
                            );
                        }}
                    />
                </>
            )}

            {!preview && (
                <img
                    className={s.image_upload}
                    src={ImgFileUpload}
                    alt="upload"
                />
            )}

            {helperText && <p className={s.helper_text}>{helperText}</p>}

            {isDragActive && !helperText ? (
                <p className={s.helper_text}>Drop the Image here ...</p>
            ) : !preview && !helperText ? (
                <p className={s.helper_text}>Drag the Image here, or click</p>
            ) : null}
        </div>
    );
};

export default ImageFileUpload;
