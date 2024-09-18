import { FC } from "react";
import { Fade } from "react-awesome-reveal";
import { IWork } from "../../assets/interfaces/interfaces";
import s from "./ModalCertificateManager.module.scss";
import ModalWorkManagerForm from "./ModalCertificateManagerForm/ModalCertificateManagerForm";
import ButtonModalClose from "../../assets/components/ButtonModalClose/ButtonModalClose";

interface IModalWorkManager {
    onClose: () => {};
    work: IWork;
}

const ModalWorkManager: FC<IModalWorkManager> = ({ onClose, work }) => {
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
                        {work ? "Update Work" : "Create Work"}
                    </Fade>
                </div>
                <ModalWorkManagerForm onClose={onClose} work={work} />
            </div>
        </div>
    );
};

export default ModalWorkManager;
