import { FC } from "react";
import s from "./HeaderAuthInfo.module.scss";
import { UserInfo } from "../../forms/AuthForm/auth";

interface HeaderAuthInfoProps {
    user: UserInfo;
}

const HeaderAuthInfo: FC<HeaderAuthInfoProps> = ({ user }) => {
    console.log("user", user);

    return (
        <div className={s.auth_info}>
            <img
                className={s.auth_info__avatar}
                src={user.photoURL}
                alt="avatar"
            />
            <div className={s.auth_info__data}>
                <span>You: </span>
                {user.firstName ? (
                    <span>{user.firstName}</span>
                ) : (
                    <>
                        <span>{user.firstName} </span>
                        <span>{user.lastName}</span>
                    </>
                )}
            </div>
        </div>
    );
};

export default HeaderAuthInfo;
