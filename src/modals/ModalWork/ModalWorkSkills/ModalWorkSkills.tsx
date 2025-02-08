import s from "./ModalWorkSkills.module.scss";

import ProgressBar from "../../../assets/components/ProgressBar/ProgressBar";
import { parseCamelCase } from "../../../assets/helpers/helpers";
import { FC, useState } from "react";
import { Technology } from "../../../assets/interfaces/interfaces";
import { Slider } from "@mui/material";
import { IWork } from "../../../assets/interfaces/NewInterfaces";

interface SkillsProps {
    technology: IWork["frontTech"] | IWork["backTech"];
    mixin?: string;
    title: string;
    editSkills: boolean;
    onChange: (apply: Technology["apply"], name: Technology["name"]) => void;
}

const Skills: FC<SkillsProps> = ({
    technology = {},
    mixin,
    title,
    editSkills,
    onChange,
}) => {
    const [sliderValues, setSliderValues] = useState<{ [key: string]: number }>(
        {}
    );

    const handleSliderChange = (name: string, newValue: number) => {
        setSliderValues((prevValues) => ({
            ...prevValues,
            [name]: newValue,
        }));
        onChange(newValue, name);
    };

    return (
        <div className={`${mixin} ${s.skills}`}>
            <div className={s.skills__header}>{title}</div>
            {Object.entries(technology).map(([group, skills], i) => {
                return (
                    <div key={i} className={s.skills__group}>
                        <h3 className={s.skills__group_title}>
                            {parseCamelCase(group)}
                        </h3>
                        {skills.map((skill, j: number) => {
                            return (
                                <div key={j}>
                                    {editSkills ? (
                                        <div className={s.skills__group_edit}>
                                            <div
                                                className={
                                                    s.skills__group_edit_title
                                                }
                                            >
                                                {skill.name}
                                            </div>
                                            <Slider
                                                value={
                                                    sliderValues[skill.name] ||
                                                    skill.apply
                                                }
                                                onChange={(e, v) =>
                                                    handleSliderChange(
                                                        skill.name,
                                                        v as number
                                                    )
                                                }
                                                component={"div"}
                                                aria-label="Temperature"
                                                defaultValue={skill.apply}
                                                valueLabelDisplay="auto"
                                                step={10}
                                                marks
                                                min={10}
                                                max={100}
                                                color="info"
                                                size="medium"
                                            />
                                        </div>
                                    ) : (
                                        <ProgressBar
                                            text={skill.name}
                                            precentFill={skill.apply}
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );
};

export default Skills;
