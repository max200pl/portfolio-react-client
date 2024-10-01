// https://tkdodo.eu/blog/mastering-mutations-in-react-query
// https://majidlotfinia.medium.com/react-query-best-practices-separating-concerns-with-custom-hooks-3f1bc9051fa2

import {
    InvalidateQueryFilters,
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";
import { fillFormData } from "../helpers/helpers";
import { InterfaceTechnologies } from "../interfaces/interfaces";
import { ICertificate } from "../interfaces/interfaces";
import { baseQuery, BaseQueryOptions } from "./api.helper";
import { CERTIFICATES_API_BASE_URL } from "./constants";

export type TypeActionForm = "update" | "create" | "delete";

enum Tag {
    CERTIFICATES = "certificates",
    CATEGORIES = "categories",
    TECHNOLOGIES = "technologies",
}

export const useGetCertificatesQuery = (filter: { category: string }) => {
    const baseQueryFn = baseQuery;

    const url = `${CERTIFICATES_API_BASE_URL}`;
    const params = { ...filter };

    return useQuery<ICertificate[], Error>({
        queryKey: [Tag.CERTIFICATES, Tag.CATEGORIES, filter.category],
        queryFn: () =>
            baseQueryFn({
                url,
                params,
            }),
    });
};

export interface SaveCertificate extends Omit<ICertificate, "cardImage"> {
    image: File | undefined;
}

const deleteCertificate = async ({
    certificateId,
    typeActionForm,
    method,
}: {
    certificateId: ICertificate["_id"];
    typeActionForm: TypeActionForm;
    method: BaseQueryOptions["method"];
}): Promise<ICertificate["_id"]> => {
    try {
        const url = `${CERTIFICATES_API_BASE_URL}/${typeActionForm}`;

        const result = await baseQuery({
            url,
            method,
            params: { id: certificateId },
        });

        return result as ICertificate["_id"];
    } catch (error) {
        console.error("Error deleting certificate:", error);
        throw error;
    }
};

export const useDeleteCertificateMutation = () => {
    const queryClient = useQueryClient();

    return useMutation<ICertificate["_id"], Error, ICertificate["_id"]>({
        mutationFn: (certificateId) =>
            deleteCertificate({
                certificateId,
                typeActionForm: "delete",
                method: "delete",
            }),
        onSuccess: () => {
            queryClient.invalidateQueries([
                Tag.CERTIFICATES,
            ] as InvalidateQueryFilters);
        },
        onError: (error) => {
            console.error(error.message);
        },
    });
};

const saveCertificate = async ({
    certificate,
    typeActionForm,
    method,
}: {
    certificate: SaveCertificate | Partial<SaveCertificate>;
    typeActionForm: TypeActionForm;
    method: BaseQueryOptions["method"];
}): Promise<ICertificate> => {
    try {
        const url = `${CERTIFICATES_API_BASE_URL}/${typeActionForm}`;
        const contentType = "multipart/form-data";

        const formData = new FormData();

        fillFormData(formData, certificate);

        if (certificate.image !== undefined) {
            if (certificate.image && certificate.image instanceof File) {
                formData.append("image", certificate.image);
            } else {
                throw new Error("Invalid image data");
            }
        }

        const result = await baseQuery({
            url,
            contentType,
            method,
            body: formData,
        });

        return result as ICertificate;
    } catch (error) {
        console.error("Error creating certificate:", error);
        throw error;
    }
};

export const useCreateCertificateMutation = () => {
    const queryClient = useQueryClient();

    return useMutation<ICertificate, Error, SaveCertificate, unknown>({
        mutationFn: (certificate) =>
            saveCertificate({
                certificate,
                typeActionForm: "create",
                method: "post",
            }),
        onSuccess: () => {
            queryClient.invalidateQueries([
                Tag.CERTIFICATES,
            ] as InvalidateQueryFilters);
        },
        onError: (error) => {
            console.error(error.message);
        },
    });
};

export const useUpdateCertificatesMutation = () => {
    const queryClient = useQueryClient();

    return useMutation<ICertificate, Error, Partial<SaveCertificate>, unknown>({
        mutationFn: (certificate: Partial<SaveCertificate>) =>
            saveCertificate({
                certificate,
                typeActionForm: "update",
                method: "put",
            }),
        onSuccess: () => {
            queryClient.invalidateQueries([
                Tag.CERTIFICATES,
            ] as InvalidateQueryFilters);
        },
        onError: (error) => {
            console.error(error.message);
        },
    });
};

export function useGetCategoriesCertificatesQuery() {
    const baseQueryFn = baseQuery;
    const url = `${CERTIFICATES_API_BASE_URL}/categories`;

    return useQuery<ICertificate[], Error>({
        queryKey: [Tag.CATEGORIES],
        queryFn: () =>
            baseQueryFn({
                url,
            }),
    });
}

export function useGetTechnologiesCertificatesQuery() {
    const baseQueryFn = baseQuery;
    const url = `${CERTIFICATES_API_BASE_URL}/technologies`;

    return useQuery<InterfaceTechnologies, Error>({
        queryKey: [Tag.TECHNOLOGIES],
        queryFn: () =>
            baseQueryFn({
                url,
            }),
    });
}
