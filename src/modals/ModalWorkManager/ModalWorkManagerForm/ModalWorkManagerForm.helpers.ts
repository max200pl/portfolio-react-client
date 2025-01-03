import { CheckboxesTagsOptions } from "../../../assets/components/AutocompleteTagsCheckboxesMUI/AutocompleteTagsCheckboxesMUI";
import {
    ITechnology,
    InterfaceTechWithApply,
    Technology,
    TechnologyName,
} from "../../../assets/interfaces/interfaces";

function processValues(
    group: string,
    values: undefined | TechnologyName[] | Technology[]
): CheckboxesTagsOptions {
    if (!values) {
        return [];
    }

    return values.map((value) => ({
        group,
        value:
            typeof value === "object" && value !== null && !Array.isArray(value)
                ? value.name
                : String(value),
    }));
}

export const getOptionsGroupAutocomplete = <
    T extends ITechnology[] | InterfaceTechWithApply[]
>(
    technologies: T
): CheckboxesTagsOptions => {
    const optionsPrep: CheckboxesTagsOptions = [];

    technologies.forEach((groupData) => {
        optionsPrep.push(
            ...Object.entries(groupData).flatMap(([group, values]) =>
                processValues(group, values)
            )
        );
    });

    return optionsPrep;
};

export const prepareDataForRequest = (data: any, image: File | undefined) => {
    return {
        ...data,
        image: image,
        frontTech: data.frontTech ? prepareTech(data.frontTech) : undefined,
        backTech: prepareTech(data.backTech),
    };
};

export const prepareTech = (
    tech: CheckboxesTagsOptions
): { [key: string]: Technology[] } => {
    const apply = 100;

    return tech.reduce((acc, currentTech) => {
        const groupName = currentTech.group;
        if (!acc[groupName]) {
            acc[groupName] = [];
        }
        acc[groupName].push({ apply, name: currentTech.value });
        return acc;
    }, {} as { [key: string]: Technology[] });
};
