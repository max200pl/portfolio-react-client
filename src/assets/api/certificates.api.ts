// https://tkdodo.eu/blog/mastering-mutations-in-react-query
// https://majidlotfinia.medium.com/react-query-best-practices-separating-concerns-with-custom-hooks-3f1bc9051fa2

import {
    InvalidateQueryFilters,
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";
import { fillFormData } from "../helpers/helpers";
import { baseQuery, BaseQueryOptions } from "./api.helper";
import { CERTIFICATES_API_BASE_URL } from "./constants";
import {
    Category,
    CertificateCategory,
    ICertificate,
} from "../interfaces/NewInterfaces";

export type TypeActionForm = "update" | "create" | "delete";

enum Tag {
    CERTIFICATES = "certificates",
    CATEGORIES = "categories",
    TECHNOLOGIES = "technologies",
}

export const useGetCertificatesQuery = (
    filter: Category["_id"] | undefined,
    options?: { skip: boolean }
) => {
    const baseQueryFn = baseQuery;

    const url = `${CERTIFICATES_API_BASE_URL}`;
    const params = filter ? { category: filter } : {};

    return useQuery<ICertificate[], Error>({
        queryKey: [Tag.CERTIFICATES, Tag.CATEGORIES, filter],
        queryFn: () =>
            baseQueryFn({
                url,
                params,
            }),
        enabled: !options?.skip,
        retry: (failureCount, error: any) => {
            if (error?.response?.status === 401) {
                return false;
            }
            return failureCount < 3;
        },
    });
};

export interface SaveCertificate
    extends Omit<ICertificate, "cardImage" | "category"> {
    image: File | undefined;
    category: CertificateCategory["_id"];
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
            params: { _id: certificateId },
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

    return useQuery<CertificateCategory[], Error>({
        queryKey: [Tag.CATEGORIES],
        queryFn: () =>
            baseQueryFn({
                url,
            }),
    });
}
