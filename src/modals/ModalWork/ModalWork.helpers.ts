import { IWork } from "../../assets/interfaces/NewInterfaces";

export const modifyTechnologyUsage = ({
    apply,
    nameTeh,
    techType,
    prevWork,
}: {
    prevWork: IWork;
    apply: number;
    nameTeh: string;
    techType: "frontTech" | "backTech";
}): IWork => {
    const newTechnology = {
        ...prevWork[techType],
    };

    Object.keys(newTechnology).forEach((category) => {
        newTechnology[category] = newTechnology[category].map((tech) => {
            if (tech.name === nameTeh) {
                console.log(
                    `Updating ${nameTeh} in ${category} to apply: ${apply}`
                );
                return {
                    ...tech,
                    apply,
                };
            }
            return tech;
        });
    });

    return {
        ...prevWork,
        [techType]: newTechnology,
    };
};
