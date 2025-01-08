import {
    Category,
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

export const getUniqCategoriesCertificates = (
    certificates: ICertificate[]
): Category[] => {
    const uniqCategories = new Set<string>();
    const categoriesMap = new Map<string, Category>();

    certificates.forEach((certificate) => {
        if (certificate.category) {
            const categoryId = certificate.category._id;
            if (!uniqCategories.has(categoryId)) {
                uniqCategories.add(categoryId);
                categoriesMap.set(categoryId, certificate.category);
            }
        }
    });

    const categories = Array.from(categoriesMap.values());

    console.log("categories", categories);

    return categories;
};
