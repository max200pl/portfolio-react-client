import {
    CertificateCategory,
    ICertificate,
} from "../../assets/interfaces/NewInterfaces";

export const getCertificateCategoryNames = (
    categories: CertificateCategory[],
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
        if (isCategory && category.label) {
            acc.push(category.label);
        }
        return acc;
    }, []);
};
