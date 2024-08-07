import { IWork } from "../../assets/interfaces/interfaces";

export const updateTechnology = (
    work: IWork,
    apply: number,
    nameTeh: string
): IWork["frontTech"] => {
    return work.frontTech.map((group) => {
        return {
            [Object.keys(group)[0]]: group[Object.keys(group)[0]].map(
                (skill) => {
                    return skill.name === nameTeh
                        ? {
                              name: skill.name,
                              apply: apply,
                          }
                        : skill;
                }
            ),
        };
    });
};
