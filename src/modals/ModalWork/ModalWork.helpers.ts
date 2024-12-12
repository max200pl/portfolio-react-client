import {
    IWork,
    InterfaceTechWithApply,
    Technology,
} from "../../assets/interfaces/interfaces";

export const updateTechnology = (
    work: IWork,
    apply: number,
    nameTeh: string,
    techType: "frontTech" | "backTech"
): InterfaceTechWithApply => {
    const updatedTech: InterfaceTechWithApply = {};

    Object.entries(work[techType]).forEach(([group, skills]) => {
        updatedTech[group] = skills.map((skill: Technology) => {
            return skill.name === nameTeh
                ? {
                      name: skill.name,
                      apply: apply,
                  }
                : skill;
        });
    });

    return updatedTech;
};
