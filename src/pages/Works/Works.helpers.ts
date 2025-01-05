import { defUrlWorkImage } from "../../assets/api/constants";
import { getFolderName, getImageName } from "../../assets/helpers/helpers";
import { Category, IWork } from "../../assets/interfaces/NewInterfaces";

export const getUrlWorkImage = (image: any) => {
    const folderName = getFolderName(image);
    const imageName = getImageName(image);

    return defUrlWorkImage(folderName, imageName);
};

export const extractUniqueCategories = (
    categories: Category[] | undefined,
    works: IWork[] | undefined
) => {
    const uniqueCategories = categories?.filter((category) =>
        works?.some((work) => work.category._id === category._id)
    );
    return uniqueCategories;
};

export const extractUniqueCategoryLabels = (
    categories: Category[] | undefined,
    uniqueCategoryIds: Category["_id"][]
) => {
    return categories?.filter((category) =>
        uniqueCategoryIds.includes(category._id)
    );
};

export const getCurrentWork = (works: any[], currentWork: { name: any }) => {
    return works.filter(
        (work: { name: any }) => work.name === currentWork.name
    );
};
