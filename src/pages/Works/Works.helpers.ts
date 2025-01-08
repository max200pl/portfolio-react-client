import { defUrlWorkImage } from "../../assets/api/constants";
import { getFolderName, getImageName } from "../../assets/helpers/helpers";
import { Category, IWork } from "../../assets/interfaces/NewInterfaces";

export const getUrlWorkImage = (image: any) => {
    const folderName = getFolderName(image);
    const imageName = getImageName(image);

    return defUrlWorkImage(folderName, imageName);
};

export const extractUniqueCategoryLabels = (
    categories: Category[] | undefined,
    uniqueCategoryIds: Category["_id"][]
) => {
    return categories?.filter((category) =>
        uniqueCategoryIds.includes(category._id)
    );
};

export const getUniqCategoriesWork = (works: IWork[]): Category[] => {
    const uniqCategories = new Set<string>();
    const categoriesMap = new Map<string, Category>();

    works.forEach((work) => {
        if (work.category) {
            const categoryId = work.category._id;
            if (!uniqCategories.has(categoryId)) {
                uniqCategories.add(categoryId);
                categoriesMap.set(categoryId, work.category);
            }
        }
    });

    const categories = Array.from(categoriesMap.values());

    console.log("categories", categories);

    return categories;
};

export const getCurrentWork = (works: any[], currentWork: { name: any }) => {
    return works.filter(
        (work: { name: any }) => work.name === currentWork.name
    );
};
