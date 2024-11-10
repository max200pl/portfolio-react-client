import {
    CategoryCertificate,
    ICertificate,
} from "../../assets/interfaces/interfaces";

export const getCertificateCategoryNames = (
    categories: CategoryCertificate[],
    certificates: ICertificate[]
): string[] => {
    if (!categories || !certificates) {
        return [];
    }
    return categories?.reduce((acc: string[], category) => {
        const isCategory = certificates.some(
            (certificate) => certificate.category._id === category._id
        );
        // 3. If category has certificates, push category name to the accumulator
        if (isCategory && category.type_name) {
            acc.push(category.type_name);
        }
        return acc;
    }, []);
};
