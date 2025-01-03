import s from "./Work.module.scss";
import { getYear } from "../../../assets/helpers/helpers";
import ImageLazyLoad from "../../../assets/components/ImageLazyLoad/ImageLazyLoad";
import editIcon from "../../../assets/images/intro/edit.svg";
import { Fade } from "react-awesome-reveal";
import { IWork } from "../../../assets/interfaces/NewInterfaces";

interface WorkProps {
    work: IWork;
    onCardClick: () => void;
    onClickEditWork: () => void;
    editSection: boolean;
}

export const Work = ({
    work: { name, dateFinished, category, cardImage },
    onCardClick,
    onClickEditWork,
    editSection,
}: WorkProps) => {
    return (
        <div className={s.work} onClick={() => onCardClick()}>
            {editSection && (
                <Fade
                    className={s.work__container_edit_button}
                    triggerOnce={true}
                    direction="right"
                >
                    <button
                        className={s.work__edit_button}
                        onClick={(e) => {
                            e.stopPropagation();
                            onClickEditWork();
                        }}
                    >
                        <img src={editIcon} alt="Close" />
                    </button>
                </Fade>
            )}

            <div className={s.work__image}>
                {cardImage?.url && cardImage?.blurHash && (
                    <ImageLazyLoad
                        mixin="work"
                        blurHash={cardImage.blurHash}
                        url={cardImage?.url}
                    />
                )}
            </div>

            <div className={s.content}>
                <div className={s.content__cat}>{category.label}</div>
                <div className={s.content__title}>
                    {name}
                    <time className={s.content__date}>
                        {getYear(dateFinished)}
                    </time>
                </div>
            </div>
        </div>
    );
};
