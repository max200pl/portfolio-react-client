import s from "./Certificate.module.scss";
import {
    getFolderName,
    getImageName,
    getYear,
} from "../../../assets/helpers/helpers";
import ImageLazyLoad from "../../../assets/components/ImageLazyLoad/ImageLazyLoad";
import { defUrlWorkImage } from "../../../assets/api/constants";
import editIcon from "../../../assets/images/intro/edit.svg";
import { Fade } from "react-awesome-reveal";

export const Certificate = ({
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
        <div className={s.certificate} onClick={() => onCardClick()}>
            <div className={s.certificate__container}>
                {editSection && (
                    <Fade
                        className={s.certificate__container_edit_button}
                        triggerOnce="true"
                        direction="right"
                    >
                        <button
                            className={s.certificate__edit_button}
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

                <div className={s.certificate__image}>
                    <ImageLazyLoad
                        mixin="work"
                        blurHash={cardImage.blurHash}
                        name={cardImage.name}
                        url={urlImage}
                    />
                </div>

                <div className={s.certificate__content}>
                    <div className={s.certificate__cat}>{category}</div>
                    <div className={s.certificate__title}>
                        {name}
                        <time className={s.certificate__date}>
                            {getYear(dateFinished)}
                        </time>
                    </div>
                </div>
            </div>
        </div>
    );
};
