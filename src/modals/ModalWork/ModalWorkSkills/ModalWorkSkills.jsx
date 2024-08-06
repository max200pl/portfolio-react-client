import s from "./ModalWorkSkills.module.scss";

import ProgressBar from "../../../assets/components/ProgressBar/ProgressBar";
import { parseCamelCase } from "../../../assets/helpers/helpers";

const Skills = ({ technology, mixin, position, title }) => {
    return (
        <div position={position} mixin={mixin} className={s.skills}>
            <div className={s.skills__header}>{title}</div>
            {technology.map((group, i) => {
                return (
                    <div key={i} className={s.skills__group}>
                        <h3 className={s.skills__group_title}>
                            {parseCamelCase(Object.keys(group)[0])}
                        </h3>
                        {Object.values(group)[0].map((skill, j) => {
                            return (
                                <ProgressBar
                                    text={skill.name}
                                    precentFill={skill.apply}
                                />
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );
};

export default Skills;
