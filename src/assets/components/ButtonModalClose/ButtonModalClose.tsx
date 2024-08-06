import { FC } from "react";
import exitImg from "../../images/modal/exit.svg";
import classNames from "classnames";
import s from "./ButtonModalClose.module.scss";

interface ButtonModalCloseProps {
    onClick: () => void;
    mixin?: string;
}

const ButtonModalClose: FC<ButtonModalCloseProps> = ({ onClick, mixin }) => {
    return (
        <button
            className={classNames(s.button, mixin)}
            onClick={() => onClick()}
            type="button"
        >
            <img className={s.button__image} src={exitImg} alt="Close" />
        </button>
    );
};

export default ButtonModalClose;
