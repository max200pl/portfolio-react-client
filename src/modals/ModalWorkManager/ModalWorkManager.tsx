import { FC } from "react";
import { Fade } from "react-awesome-reveal";
import { IWork } from "../../assets/interfaces/NewInterfaces";
import s from "./ModalWorkManager.module.scss";
import ModalWorkManagerForm from "./ModalWorkManagerForm/ModalWorkManagerForm";
import ButtonModalClose from "../../assets/components/ButtonModalClose/ButtonModalClose";

interface IModalWorkManager {
    onClose: () => void;
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
                        {work ? `Update Work - ${work.name}` : "Create Work"}
                    </Fade>
                </div>
                <ModalWorkManagerForm onClose={onClose} work={work} />
            </div>
        </div>
    );
};

export default ModalWorkManager;
