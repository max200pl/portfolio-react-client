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
import { WORKS_API_BASE_URL } from "./constants";
import { Category, ITechnologyStack, IWork } from "../interfaces/NewInterfaces";

export type TypeActionForm = "update" | "create" | "delete";

enum Tag {
    WORKS = "works",
    CATEGORIES = "categories",
    TECHNOLOGIES = "technologies",
}

export const useGetWorksQuery = (
    filter: Category["_id"] | undefined,
    options?: { skip: boolean }
) => {
    const baseQueryFn = baseQuery;

    const url = `${WORKS_API_BASE_URL}`;
    const params = filter ? { category: filter } : {};

    return useQuery<IWork[], Error>({
        queryKey: [Tag.WORKS, Tag.CATEGORIES, filter],
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

export interface SaveWork extends Omit<IWork, "cardImage" | "category"> {
    image: File | undefined;
    category: Category["_id"];
}

const deleteWork = async ({
    workId,
    typeActionForm,
    method,
}: {
    workId: IWork["_id"];
    typeActionForm: TypeActionForm;
    method: BaseQueryOptions["method"];
}): Promise<IWork["_id"]> => {
    try {
        const url = `${WORKS_API_BASE_URL}/${typeActionForm}`;

        console.log("Deleting work with ID:", workId);

        const result = await baseQuery({
            url,
            method,
            params: { _id: workId },
        });

        return result as IWork["_id"];
    } catch (error) {
        console.error("Error deleting work:", error);
        throw error;
    }
};

export const useDeleteWorkMutation = () => {
    const queryClient = useQueryClient();

    return useMutation<IWork["_id"], Error, IWork["_id"]>({
        mutationFn: (workId) =>
            deleteWork({ workId, typeActionForm: "delete", method: "delete" }),
        onSuccess: () => {
            queryClient.invalidateQueries([
                Tag.WORKS,
            ] as InvalidateQueryFilters);
        },
        onError: (error) => {
            console.error(error.message);
        },
    });
};

const saveWork = async ({
    work,
    typeActionForm,
    method,
}: {
    work: SaveWork | Partial<SaveWork>;
    typeActionForm: TypeActionForm;
    method: BaseQueryOptions["method"];
}): Promise<IWork> => {
    try {
        const url = `${WORKS_API_BASE_URL}/${typeActionForm}`;
        const contentType = "multipart/form-data";

        const formData = new FormData();

        fillFormData(formData, work);

        if (work.image !== undefined) {
            if (work.image && work.image instanceof File) {
                formData.append("image", work.image);
            } else {
                throw new Error("Invalid image data");
            }
        }

        console.log(
            "Saving work with data:",
            Object.fromEntries(formData.entries())
        );

        const result = await baseQuery({
            url,
            contentType,
            method,
            body: formData,
        });

        return result as IWork;
    } catch (error) {
        console.error("Error creating work:", error);
        throw error;
    }
};

export const useCreateWorkMutation = () => {
    const queryClient = useQueryClient();

    return useMutation<IWork, Error, SaveWork, unknown>({
        mutationFn: (work) =>
            saveWork({ work, typeActionForm: "create", method: "post" }),
        onSuccess: () => {
            queryClient.invalidateQueries([
                Tag.WORKS,
            ] as InvalidateQueryFilters);
        },
        onError: (error) => {
            console.error(error.message);
        },
    });
};

export const useUpdateWorkMutation = () => {
    const queryClient = useQueryClient();

    return useMutation<IWork, Error, Partial<SaveWork>, unknown>({
        mutationFn: (work: Partial<SaveWork>) =>
            saveWork({ work, typeActionForm: "update", method: "put" }),
        onSuccess: () => {
            queryClient.invalidateQueries([
                Tag.WORKS,
            ] as InvalidateQueryFilters);
        },
        onError: (error) => {
            console.error(error.message);
        },
    });
};

export function useGetCategoriesWorksQuery() {
    const baseQueryFn = baseQuery;
    const url = `${WORKS_API_BASE_URL}/categories`;

    return useQuery<Category[], Error>({
        queryKey: [Tag.CATEGORIES],
        queryFn: () =>
            baseQueryFn({
                url,
            }),
    });
}

export function useGetTechnologiesQuery() {
    const baseQueryFn = baseQuery;
    const url = `${WORKS_API_BASE_URL}/technologies`;

    return useQuery<ITechnologyStack, Error>({
        queryKey: [Tag.TECHNOLOGIES],
        queryFn: () =>
            baseQueryFn({
                url,
            }),
    });
}

/* const fetchInitializeApp = async () => {

};

const useInitializeAppQuery = () => {
    const queryClient = useQueryClient();

    return useQuery({
        queryKey: 'initializeApp',
        queryFn: fetchInitializeApp,
        onSuccess: (data) => {
            queryClient.setQueryData('initializeApp', data);
        },
    });
}; */
