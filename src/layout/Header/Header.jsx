import { NavLink } from "react-router-dom";
import s from "./Header.module.scss";
import loginImg from "../../assets/images/header/login.svg";
import home from "../../assets/images/header/home.svg";
import PortfolioImg from "../../assets/images/header/portfolio.svg";
import AboutImg from "../../assets/images/header/about.svg";
import ContactImg from "../../assets/images/header/contact.svg";
import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../../context/user-context";
import Modal from "../../assets/components/Modal/Modal";
import ModalHireMe from "../../modals/ModalHireMe/ModalHireMe";
import { ButtonBurger } from "../../assets/components/ButtonBurger/ButtonBurger";
import HeaderAuthInfo from "./HeaderAuthInfo";
import { CSSTransition } from "react-transition-group";
import { Fade } from "react-awesome-reveal";

const dataNavLink = (isAuth, logOutUserHandler) => [
    {
        name: "Hello",
        to: "/",
        alt: "base page",
        iconUrl: home,
    },
    {
        name: "About me",
        to: "/about",
        alt: "about me",
        iconUrl: AboutImg,
    },
    {
        name: "Gallery photos",
        to: "/gallery",
        alt: "my works photos",
        iconUrl: PortfolioImg,
    },
    {
        name: isAuth ? "LogOut" : "LogIn",
        to: isAuth ? "/" : "/auth/login",
        alt: "authorization",
        iconUrl: loginImg,
    },
    {
        isButton: true,
        name: "Contact me",
        to: "/contact",
        alt: "Contact me",
        iconUrl: ContactImg,
    },
];

const Header = (props) => {
    const userCtx = useContext(UserContext);
    // console.log(userCtx.isAuth, "userCtx.isAuth", userCtx.user, "userCtx.user")
    const [user, setUser] = useState();
    const [isAuth, setIsAuth] = useState();
    const [isOpenHireMeModal, setIsOpenHireMeModal] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    useEffect(() => {
        setUser(userCtx.user);
        setIsAuth(userCtx.isAuth);
    }, [userCtx.isAuth, userCtx.user]);

    return (
        <div className="container">
            {user && (
                <div className={s.header__auth_info}>
                    <HeaderAuthInfo user={user} />
                </div>
            )}
            <div className={s.header__button_burger}>
                <ButtonBurger
                    onClick={() => setShowMobileMenu(!showMobileMenu)}
                />
            </div>

            <header className={s.header}>
                <CSSTransition
                    in={showMobileMenu}
                    timeout={300}
                    classNames={{
                        enter: s["fade-enter"],
                        enterActive: s["fade-enter-active"],
                        exit: s["fade-exit"],
                        exitActive: s["fade-exit-active"],
                    }}
                    unmountOnExit
                >
                    <nav className={s.nav} id="nav">
                        {dataNavLink(isAuth, userCtx.logOutUser).map(
                            (data, id) => {
                                return (
                                    <>
                                        {!data.isButton ? (
                                            <NavLink
                                                key={id}
                                                className={({ isActive }) =>
                                                    isActive
                                                        ? s.nav__link_active
                                                        : s.nav__link
                                                }
                                                to={data.to}
                                                target={data.target}
                                                rel={data.rel}
                                                onClick={() => {
                                                    data.name === "LogOut" &&
                                                        userCtx.logOutUser();
                                                }}
                                            >
                                                <img
                                                    className={s.nav__link_img}
                                                    src={data.iconUrl}
                                                    alt={data.alt}
                                                ></img>

                                                <span
                                                    className={s.nav__link_text}
                                                >
                                                    {data.name}
                                                </span>
                                            </NavLink>
                                        ) : (
                                            <button
                                                onClick={() =>
                                                    setIsOpenHireMeModal(
                                                        !isOpenHireMeModal
                                                    )
                                                }
                                                className={
                                                    s.nav__link +
                                                    " " +
                                                    s.nav__link_btn
                                                }
                                            >
                                                <img
                                                    className={s.nav__link_img}
                                                    src={ContactImg}
                                                    alt="contact me"
                                                ></img>
                                                <span>Contact me</span>
                                            </button>
                                        )}
                                    </>
                                );
                            }
                        )}
                    </nav>
                </CSSTransition>
            </header>

            <Modal
                handleClose={() => setIsOpenHireMeModal(false)}
                isOpen={isOpenHireMeModal}
            >
                <ModalHireMe
                    onClose={() => setIsOpenHireMeModal(false)}
                    isOpen={isOpenHireMeModal}
                />
            </Modal>
        </div>
    );
};

export default Header;
