import { FC } from "react";
import { Fade } from "react-awesome-reveal";
import { ICertificate } from "../../assets/interfaces/interfaces";
import s from "./ModalCertificateManager.module.scss";
import ModalCertificateManagerForm from "./ModalCertificateManagerForm/ModalCertificateManagerForm";
import ButtonModalClose from "../../assets/components/ButtonModalClose/ButtonModalClose";

interface IModalCertificateManager {
    onClose: () => {};
    certificate: ICertificate;
}

const ModalCertificateManager: FC<IModalCertificateManager> = ({
    onClose,
    certificate,
}) => {
    return (
        <div className={s.modal}>
            <div className={s.content} onClick={(e) => e.stopPropagation()}>
                <ButtonModalClose onClick={onClose} />
                <div className={s.modal__header}>
                    <Fade
                        duration={100}
                        triggerOnce={true}
                        direction="left"
                        cascade
                        className={s.modal__title}
                    >
                        {certificate
                            ? "Update Certificate"
                            : "Create Certificate"}
                    </Fade>
                </div>
                <ModalCertificateManagerForm
                    onClose={onClose}
                    certificate={certificate}
                />
            </div>
        </div>
    );
};

export default ModalCertificateManager;
