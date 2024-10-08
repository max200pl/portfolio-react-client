import s from "./Work.module.scss";
import {
    getFolderName,
    getImageName,
    getYear,
} from "../../../assets/helpers/helpers";
import ImageLazyLoad from "../../../assets/components/ImageLazyLoad/ImageLazyLoad";
import { defUrlWorkImage } from "../../../assets/api/constants";
import editIcon from "../../../assets/images/intro/edit.svg";
import { Fade } from "react-awesome-reveal";

export const Work = ({
    category,
    dateFinished,
    name,
    cardImage,
    onCardClick,
    onClickEditWork,
    editSection,
}) => {
    const imageName = getImageName(cardImage.name);
    const folderName = getFolderName(cardImage.name);
    const urlImage = defUrlWorkImage(folderName, imageName);

    return (
        <div className={s.work} onClick={() => onCardClick()}>
            {editSection && (
                <Fade
                    className={s.work__container_edit_button}
                    triggerOnce="true"
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
                <ImageLazyLoad
                    mixin="work"
                    blurHash={cardImage.blurHash}
                    name={cardImage.name}
                    url={urlImage}
                />
            </div>

            <div className={s.content}>
                <div className={s.content__cat}>{category}</div>
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
