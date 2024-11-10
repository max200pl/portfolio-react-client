import s from "./Certificate.module.scss";
import {
    getFolderName,
    getImageName,
    getYear,
} from "../../../assets/helpers/helpers";
import ImageLazyLoad from "../../../assets/components/ImageLazyLoad/ImageLazyLoad";
import { defUrlCertificateImage } from "../../../assets/api/constants";
import editIcon from "../../../assets/images/intro/edit.svg";
import { Fade } from "react-awesome-reveal";

export const Certificate = ({
    category,
    dateFinished,
    name,
    cardImage,
    onClickEditCertificate,
    editSection,
}) => {
    const imageName = getImageName(cardImage.name);
    const folderName = getFolderName(cardImage.name);
    const urlImage = defUrlCertificateImage(folderName, imageName);

    return (
        <div className={s.certificate}>
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
                            onClickEditCertificate();
                        }}
                    >
                        <img src={editIcon} alt="Close" />
                    </button>
                </Fade>
            )}

            <div className={s.certificate__image}>
                <ImageLazyLoad
                    mixin="Certificate"
                    blurHash={cardImage.blurHash}
                    name={cardImage.name}
                    url={urlImage}
                />
            </div>

            <div className={s.content}>
                <div className={s.content__cat}>{category.type_name}</div>
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
