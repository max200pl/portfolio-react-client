import { FC } from "react";
import ButtonModalClose from "../../assets/components/ButtonModalClose/ButtonModalClose";
import s from "./ModalSeeMyResumeActionBar.module.scss";
import sButtonModalClose from "../../assets/components/ButtonModalClose/ButtonModalClose.module.scss";
interface ModalSeeMyResumeActionBarProps {
    handleClose: () => void;
    isPrinting: boolean;
    handlePrint: () => void;
    handleSavePDF: () => void;
    openHireMeModal: () => void;
}

const ModalSeeMyResumeActionBar: FC<ModalSeeMyResumeActionBarProps> = ({
    handleClose,
    handlePrint,
    handleSavePDF,
    openHireMeModal,
    isPrinting,
}) => {
    return (
        <div className={s.resume_action_bar}>
            <button
                disabled={isPrinting}
                onClick={handlePrint}
                className={s.resume_action_bar__button}
            >
                Print
            </button>
            <button
                disabled={isPrinting}
                onClick={openHireMeModal}
                className={s.resume_action_bar__button}
            >
                Hire me
            </button>
            <button
                disabled={isPrinting}
                onClick={handleSavePDF}
                className={s.resume_action_bar__button}
            >
                Download PDF
            </button>

            <ButtonModalClose
                onClick={handleClose}
                mixin={sButtonModalClose.resume}
            />
        </div>
    );
};

export default ModalSeeMyResumeActionBar;
