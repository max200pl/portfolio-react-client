import s from "./ModalWork.module.scss";
import ModalWorkSkills from "./ModalWorkSkills/ModalWorkSkills";
import { getYear } from "../../assets/helpers/helpers";
import { Fade } from "react-awesome-reveal";
import ButtonModalClose from "../../assets/components/ButtonModalClose/ButtonModalClose";
import { FC, useEffect, useState } from "react";
import { IWork } from "../../assets/interfaces/interfaces";
import { Button, Stack } from "@mui/material";
import editImg from "../../assets/images/modal/edit.svg";
import { updateTechnology } from "./ModalWork.helpres";
import { useUpdateWorkMutation } from "../../assets/api/works.api";

interface ModalWorkProps {
    onClose: () => {};
    work: IWork;
}

const ModalWork: FC<ModalWorkProps> = ({ onClose, work }) => {
    const [editSkills, setEditSkills] = useState(false);
    const [currentWork, setCurrentWork] = useState(work);
    const [skillsUpdated, setSkillsUpdated] = useState(false);

    const { mutate: updateWork } = useUpdateWorkMutation();

    const onHandleEditSkills = () => {
        setEditSkills(!editSkills);
    };

    const updateWorkHandler = () => {
        updateWork(currentWork);
    };

    useEffect(() => {
        const isFirefox = typeof (window as any).InstallTrigger !== "undefined";
        const container = document.querySelector(
            `.${s.content__container}`
        ) as HTMLElement | null;

        if (container) {
            const hasScrollbar =
                container.scrollHeight > container.clientHeight;

            if (isFirefox && hasScrollbar) {
                container.style.paddingRight = "20px";
            }
        }
    }, []);

    return (
        <div className={s.modal}>
            <div className={s.content} onClick={(e) => e.stopPropagation()}>
                <ButtonModalClose onClick={onClose} />

                <Fade
                    className={s.modal__title}
                    duration={100}
                    direction="left"
                    cascade
                >
                    {work.name}
                </Fade>

                <div className={s.modal__subtitle}>
                    {work.category}
                    <span className={s.modal__subtitle_divider}>|</span>
                    {getYear(work.dateFinished)}
                </div>

                <a
                    href={work.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={s.modal__link}
                >
                    Link to work
                </a>

                <div className={s.content__container + " custom_scroll"}>
                    <button
                        className={s.button_edit}
                        onClick={() => onHandleEditSkills()}
                        type="button"
                    >
                        <img
                            className={s.button_edit__image}
                            src={editImg}
                            alt="Close"
                        />
                    </button>

                    <ModalWorkSkills
                        title={"Frontend"}
                        mixin="works"
                        editSkills={editSkills}
                        technology={currentWork.frontTech}
                        onChange={(apply, nameTeh) => {
                            setSkillsUpdated(true);
                            setCurrentWork((prevWork) => {
                                return {
                                    ...prevWork,
                                    frontTech: updateTechnology(
                                        prevWork,
                                        apply,
                                        nameTeh
                                    ),
                                };
                            });
                        }}
                    />

                    {work.backTech.length ? (
                        <ModalWorkSkills
                            title={"Backend"}
                            mixin="works"
                            editSkills={editSkills}
                            technology={currentWork.backTech}
                            onChange={(apply, nameTeh) => {
                                setSkillsUpdated(true);
                                setCurrentWork((prevWork) => {
                                    return {
                                        ...prevWork,
                                        backTech: updateTechnology(
                                            prevWork,
                                            apply,
                                            nameTeh
                                        ),
                                    };
                                });
                            }}
                        />
                    ) : null}
                </div>

                <div className={s.modal__footer}>
                    <Stack direction="row" spacing={2}>
                        {skillsUpdated && (
                            <Button
                                className="action_button_primary"
                                variant="contained"
                                type="submit"
                                onClick={updateWorkHandler}
                            >
                                Save
                            </Button>
                        )}
                        <Button variant="outlined" onClick={() => onClose()}>
                            Close
                        </Button>
                    </Stack>
                </div>

                {/* <div className={s.content} onClick={(e) => e.stopPropagation()}>
                    <div className={s.content__slider}>
                        {work.images && (
                            <ModalWorkSlider images={work.images} />
                        )}
                    </div>

                    <div className={s.content__panel}>
                        <ModalWorkSkills
                            position="right"
                            mixin="works"
                            technology={work.frontTech}
                        />
                    </div>
                </div> */}
            </div>
        </div>
    );
};
export default ModalWork;
