import { defUrlWorkImage } from "../../assets/api/constants";
import { getFolderName, getImageName } from "../../assets/helpers/helpers";

export const getUrlWorkImage = (image) => {
    const folderName = getFolderName(image);
    const imageName = getImageName(image);

    return defUrlWorkImage(folderName, imageName);
};

export const getUniqCategoriesWork = (categories) => {
    return categories?.reduce((acc, { category }) => {
        if (!acc.includes(category)) {
            acc.push(category);
        }
        return acc;
    }, []);
};

export const getCurrentWork = (works, currentWork) => {
    return works.filter((work) => work.name === currentWork.name);
};

export const handleTechUpdate = (tech) => {
    return Object.entries(tech).reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
    }, {});
};
