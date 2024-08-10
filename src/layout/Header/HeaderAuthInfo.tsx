import { FC } from "react";
import s from "./HeaderAuthInfo.module.scss";

interface HeaderAuthInfoProps {
    user: {
        avatarUrl: string;
        name?: string;
        firstName: string;
        lastName: string;
    };
}

const HeaderAuthInfo: FC<HeaderAuthInfoProps> = ({ user }) => {
    const handleImageError = (
        e: React.SyntheticEvent<HTMLImageElement, Event>
    ) => {
        console.error("Image failed to load:", e);
        e.currentTarget.src = user.avatarUrl; // Укажите путь к изображению-заполнителю
    };

    return (
        <div className={s.auth_info}>
            <img
                className={s.auth_info__avatar}
                src={user.avatarUrl}
                alt="avatar"
                onError={handleImageError}
            />
            <div className={s.auth_info__data}>
                <span>You: </span>
                {user.name ? (
                    <span>{user.name}</span>
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
