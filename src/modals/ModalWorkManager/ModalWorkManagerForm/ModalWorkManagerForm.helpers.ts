import { CheckboxesTagsOptions } from "../../../assets/components/AutocompleteTagsCheckboxesMUI/AutocompleteTagsCheckboxesMUI";
import { Technology } from "../../../assets/interfaces/interfaces";
import {
    ITech,
    Technologies,
    TechnologyCategory,
} from "../../../assets/interfaces/NewInterfaces";

const processValues = (
    group: TechnologyCategory,
    values: any
): CheckboxesTagsOptions => {
    return values.map((value: any) => ({
        group: group,
        value: value.name,
    }));
};

export const getOptionsGroupAutocomplete = <T extends ITech | undefined>(
    technologies: T
): CheckboxesTagsOptions => {
    const options: CheckboxesTagsOptions = [];

    if (!technologies) {
        return options;
    }

    Object.keys(technologies).forEach((group) => {
        options.push(
            ...processValues(group as TechnologyCategory, technologies[group])
        );
    });

    console.log(`getOptionsGroupAutocomplete`, options);

    return options;
};

export const prepareTechForOptionsAutocomplete = (
    technologies: Technologies[]
): CheckboxesTagsOptions => {
    const options: CheckboxesTagsOptions = [];

    technologies.forEach((techGroup) => {
        (Object.keys(techGroup) as TechnologyCategory[]).forEach((group) => {
            techGroup[group].forEach((tech) => {
                options.push({ group, value: tech });
            });
        });
    });

    console.log(`prepareTechForOptionsAutocomplete`, options);

    return options;
};

export const prepareDataForRequest = (data: any, image: File | undefined) => {
    return {
        ...data,
        image: image,
        frontTech: data.frontTech ? prepareTech(data.frontTech) : undefined,
        backTech: prepareTech(data.backTech),
    };
};

export const prepareTech = (tech: CheckboxesTagsOptions): ITech => {
    const apply = 100;

    return tech.reduce((acc, currentTech) => {
        const groupName = currentTech.group;
        if (!acc[groupName]) {
            acc[groupName] = [];
        }
        acc[groupName].push({ apply, name: currentTech.value });
        return acc;
    }, {} as ITech);
};
