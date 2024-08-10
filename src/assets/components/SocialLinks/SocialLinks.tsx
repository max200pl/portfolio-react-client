import { FC } from "react";
import s from "./SocialLinks.module.scss";

import socialLink1 from "./../../images/intro/1.png";
import socialLink2 from "./../../images/intro/2.png";
import socialLink3 from "./../../images/intro/3.png";
import socialLink4 from "./../../images/intro/4.png";
import socialLink5 from "./../../images/intro/5.png";
import socialLink6 from "./../../images/intro/6.svg";

const dataSocialLinks = [
    {
        icon: socialLink1,
        link: "https://www.instagram.com/maksym.poskannyi/?hl=ru",
    },
    {
        icon: socialLink2,
        link: "https://www.linkedin.com/in/maksym-poskannyi-114b08155/",
    },
    {
        icon: socialLink6,
        link: "https://github.com/max200pl",
    },
    {
        icon: socialLink3,
        link: "https://www.facebook.com/Maksym.Poskannyi",
    },
    {
        icon: socialLink4,
        link: "viber://chat?number=+380508669945",
    },
    {
        icon: socialLink5,
        link: "https://t.me/max200pl",
    },
];

export const SocialLinks = () => (
    <div className={s.social_links}>
        {dataSocialLinks.map((item, index) => (
            <a
                key={index}
                className={s.link}
                rel="noreferrer"
                href={item.link}
                target="_blank"
            >
                <img src={item.icon} alt="link instagram" />
            </a>
        ))}
    </div>
);
