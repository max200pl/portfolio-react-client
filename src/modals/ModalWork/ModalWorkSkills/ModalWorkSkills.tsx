import s from "./ModalWorkSkills.module.scss";

import ProgressBar from "../../../assets/components/ProgressBar/ProgressBar";
import { parseCamelCase } from "../../../assets/helpers/helpers";
import { FC } from "react";
import { IWork, Technology } from "../../../assets/interfaces/interfaces";
import { Slider } from "@mui/material";

interface SkillsProps {
    technology: IWork["frontTech"] | IWork["backTech"];
    mixin?: string;
    title: string;
    editSkills: boolean;
    onChange: (apply: Technology["apply"], nameTeh: Technology["name"]) => void;
}

const Skills: FC<SkillsProps> = ({
    technology,
    mixin,
    title,
    editSkills,
    onChange,
}) => {
    return (
        <div className={`${mixin} ${s.skills}`}>
            <div className={s.skills__header}>{title}</div>
            {technology.map((group, i) => {
                return (
                    <div key={i} className={s.skills__group}>
                        <h3 className={s.skills__group_title}>
                            {parseCamelCase(Object.keys(group)[0])}
                        </h3>
                        {Object.values(group)[0].map((skill, j) => {
                            return (
                                <>
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
                                                onChange={(e, v) =>
                                                    onChange(
                                                        v as number,
                                                        skill.name
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
                                                size="small"
                                            />
                                        </div>
                                    ) : (
                                        <ProgressBar
                                            text={skill.name}
                                            precentFill={skill.apply}
                                        />
                                    )}
                                </>
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );
};

export default Skills;
