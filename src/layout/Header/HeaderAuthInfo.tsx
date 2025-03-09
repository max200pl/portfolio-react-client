import { FC } from "react";
import s from "./HeaderAuthInfo.module.scss";
import { UserInfo } from "../../forms/AuthForm/auth";
import UserImg from "./Img/user.svg";

interface HeaderAuthInfoProps {
    user: UserInfo;
}

const HeaderAuthInfo: FC<HeaderAuthInfoProps> = ({ user }) => {
    const displayName =
        user.displayName ||
        user.fullName ||
        `${user.firstName} ${user.lastName}`;

    return (
        <div className={s.auth_info}>
            <img
                className={s.auth_info__avatar}
                src={user.photoURL ?? UserImg}
                alt="avatar"
            />
            <div className={s.auth_info__data}>
                <span>You: </span>
                <span>{displayName}</span>
            </div>
            <div className={s.auth_info__data}>
                <span>Role: </span>
                <span>{user.roles}</span>
            </div>
        </div>
    );
};

export default HeaderAuthInfo;
