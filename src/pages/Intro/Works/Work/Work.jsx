import s from "./Work.module.scss";
import {
    getFolderName,
    getImageName,
    getYear,
} from "../../../../assets/helpers/helpers";
import ImageLazyLoad from "../../../../assets/components/ImageLazyLoad/ImageLazyLoad";
import { defUrlWorkImage } from "../../../../assets/api/constants";
import editIcon from "../../../../assets/images/intro/edit.svg";
import { Fade } from "react-awesome-reveal";

export const Work = ({
    category,
    date,
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
            <div className={s.work__container}>
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
                            <img
                                className={s.button__image}
                                src={editIcon}
                                alt="Close"
                            />
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

                <div className={s.work__content}>
                    <div className={s.work__cat}>{category}</div>
                    <div className={s.work__title}>
                        {name}
                        <time className={s.work__date}>{getYear(date)}</time>
                    </div>
                </div>
            </div>
        </div>
    );
};
