import s from "./ModalWork.module.scss";
import ModalWorkSkills from "./ModalWorkSkills/ModalWorkSkills";
import { getYear } from "../../assets/helpers/helpers";
import { Fade } from "react-awesome-reveal";
import ButtonModalClose from "../../assets/components/ButtonModalClose/ButtonModalClose";
import { FC } from "react";
import { IWork } from "../../assets/interfaces/interfaces";
import { Button, Stack } from "@mui/material";

interface ModalWorkProps {
    onClose: () => {};
    work: IWork;
}

const ModalWork: FC<ModalWorkProps> = ({ onClose, work }) => {
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
                    href="https://devmax.info/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={s.modal__link}
                >
                    Link to work
                </a>

                <div className={s.content__container + " custom_scroll"}>
                    <ModalWorkSkills
                        title={"Frontend"}
                        position="right"
                        mixin="works"
                        technology={work.frontTech}
                    />

                    {work.backTech.length ? (
                        <ModalWorkSkills
                            title={"Backend"}
                            position="right"
                            mixin="works"
                            technology={work.backTech}
                        />
                    ) : null}
                </div>

                <div className={s.modal__footer}>
                    <Button variant="outlined" onClick={() => onClose()}>
                        Close
                    </Button>
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
