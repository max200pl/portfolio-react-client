import s from "./Certificate.module.scss";
import { getYear } from "../../../assets/helpers/helpers";
import ImageLazyLoad from "../../../assets/components/ImageLazyLoad/ImageLazyLoad";
import editIcon from "../../../assets/images/intro/edit.svg";
import { Fade } from "react-awesome-reveal";
import { ICertificate } from "../../../assets/interfaces/NewInterfaces";

type CertificateProps = {
    certificate: ICertificate;
    onClickEditCertificate: () => void;
    editSection: boolean;
};

export const Certificate = ({
    certificate: { name, dateFinished, category, cardImage },
    onClickEditCertificate,
    editSection,
}: CertificateProps) => {
    return (
        <div className={s.certificate}>
            {editSection && (
                <Fade
                    className={s.certificate__container_edit_button}
                    triggerOnce={true}
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
                {cardImage?.url && cardImage?.blurHash && (
                    <ImageLazyLoad
                        mixin="Certificate"
                        blurHash={cardImage.blurHash}
                        url={cardImage.url}
                    />
                )}
            </div>

            <div className={s.content}>
                <div className={s.content__cat}>{category.label}</div>
                <div className={s.content__title}>
                    {name}
                    {dateFinished && (
                        <time className={s.content__date}>
                            {getYear(dateFinished)}
                        </time>
                    )}
                </div>
            </div>
        </div>
    );
};
