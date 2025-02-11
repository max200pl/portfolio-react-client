import { NavLink } from "react-router-dom";
import s from "./Header.module.scss";
import loginImg from "../../assets/images/header/login.svg";
import home from "../../assets/images/header/home.svg";
import PortfolioImg from "../../assets/images/header/portfolio.svg";
import AboutImg from "../../assets/images/header/about.svg";
import ContactImg from "../../assets/images/header/contact.svg";
import { useContext, useEffect, useState } from "react";
import { UserSessionContext } from "../../context/user-context";
import Modal from "../../assets/components/Modal/Modal";
import ModalHireMe from "../../modals/ModalHireMe/ModalHireMe";
import { ButtonBurger } from "../../assets/components/ButtonBurger/ButtonBurger";
import HeaderAuthInfo from "./HeaderAuthInfo";

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
        name: "Works",
        to: "/works",
        alt: "works",
        iconUrl: PortfolioImg,
    },
    {
        name: "Certificates",
        to: "/certificates",
        alt: "certificates",
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
    const userCtx = useContext(UserSessionContext);
    // console.log(userCtx.isAuth, "userCtx.isAuth", userCtx.user, "userCtx.user")
    const [user, setUser] = useState();
    const [isAuth, setIsAuth] = useState();
    const [isOpenHireMeModal, setIsOpenHireMeModal] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            if (!isInitialized) {
                if (window.innerWidth > 768) {
                    setShowMobileMenu(true);
                } else {
                    setShowMobileMenu(false);
                }
                setIsInitialized(true);
            }
        };

        handleResize();

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [isInitialized]);

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
                {/* <CSSTransition
                    in={showMobileMenu}
                    timeout={300}
                    classNames={{
                        enter: s["fade-enter"],
                        enterActive: s["fade-enter-active"],
                        exit: s["fade-exit"],
                        exitActive: s["fade-exit-active"],
                    }}
                    unmountOnExit
                > */}
                <nav className={s.nav} id="nav">
                    {dataNavLink(isAuth, userCtx.clearUserSession).map(
                        (data, id) => {
                            return (
                                <div key={id}>
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
                                                    userCtx.clearUserSession();
                                            }}
                                        >
                                            <img
                                                className={s.nav__link_img}
                                                src={data.iconUrl}
                                                alt={data.alt}
                                                loading="lazy"
                                            ></img>

                                            <span className={s.nav__link_text}>
                                                {data.name}
                                            </span>
                                        </NavLink>
                                    ) : (
                                        <button
                                            key={id}
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
                                </div>
                            );
                        }
                    )}
                </nav>
                {/* </CSSTransition> */}
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
