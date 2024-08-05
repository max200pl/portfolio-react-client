import { FC } from "react";
import exitImg from "../../images/modal/exit.svg";
import s from "./ButtonModalClose.module.scss";

interface ButtonModalCloseProps {
    onClick: () => void;
}

const ButtonModalClose: FC<ButtonModalCloseProps> = ({ onClick }) => {
    return (
        <button className={s.button} onClick={() => onClick()} type="button">
            <img className={s.button__image} src={exitImg} alt="Close" />
        </button>
    );
};

export default ButtonModalClose;
