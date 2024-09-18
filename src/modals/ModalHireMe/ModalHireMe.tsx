import s from "./ModalHireMe.module.scss";
import emailImg from "../../assets/images/modal/modal-form/email.svg";
import phoneImg from "../../assets/images/modal/modal-form/phone.svg";
import { FC } from "react";
import ButtonModalClose from "../../assets/components/ButtonModalClose/ButtonModalClose";
import { Fade } from "react-awesome-reveal";
import ModalHireMeForm from "./ModalHireMeForm/ModalHireMeForm";
import { SocialLinks } from "../../assets/components/SocialLinks/SocialLinks";

interface IModalWorkManager {
    onClose: () => void;
}

const ModalHireMe: FC<IModalWorkManager> = ({ onClose }) => {
    return (
        <div className={s.modal}>
            <div className={s.content} onClick={(e) => e.stopPropagation()}>
                <ButtonModalClose onClick={onClose} />

                <div className={s.contact}>
                    <div className={s.modal__header}></div>

                    <Fade
                        className={s.modal__title}
                        duration={100}
                        direction="left"
                        cascade
                    >
                        Let's talk!
                    </Fade>
                    <div className={s.modal__subtitle}>
                        Call me or send me request
                    </div>

                    <ul className={s.contact__info}>
                        <li className={s.contact__info_item}>
                            <img
                                className={s.contact__info_icon}
                                src={phoneImg}
                                alt=""
                            />
                            <a
                                className={s.contact__info_tel}
                                href="tel:+380508669945"
                            >
                                (+380) 508 669 945
                            </a>
                        </li>
                        <li className={s.contact__info_item}>
                            <img
                                className={s.contact__info_icon}
                                src={emailImg}
                                alt=""
                            />
                            <a
                                href="mailto:max2000pl@gmail.com"
                                className={s.contact__info_email}
                            >
                                max2000pl@gmail.com
                            </a>
                        </li>
                        <SocialLinks />
                    </ul>

                    <ModalHireMeForm onClose={onClose} />
                </div>
            </div>
        </div>
    );
};

export default ModalHireMe;
