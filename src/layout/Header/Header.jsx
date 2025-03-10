import { NavLink, useNavigate } from "react-router-dom";
import s from "./Header.module.scss";
import loginImg from "../../assets/images/header/login.svg";
import home from "../../assets/images/header/home.svg";
import PortfolioImg from "../../assets/images/header/portfolio.svg";
import AboutImg from "../../assets/images/header/about.svg";
import ContactImg from "../../assets/images/header/contact.svg";
import { useContext, useEffect, useState } from "react";
import Modal from "../../assets/components/Modal/Modal";
import ModalHireMe from "../../modals/ModalHireMe/ModalHireMe";
import { ButtonBurger } from "../../assets/components/ButtonBurger/ButtonBurger";
import HeaderAuthInfo from "./HeaderAuthInfo";
import { AuthContext } from "../../context/auth-context";

const dataNavLink = (isAuth) => [
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
        to: isAuth ? "#" : "/auth/login",
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

const handleLogoutClick = async (navigate, signOut) => {
    try {
        await signOut();
        // alert("Successfully signed out.");
        navigate("/");
    } catch (error) {
        console.error("Error signing out:", error);
        // alert("Error signing out. Please try again.");
    }
};

const Header = () => {
    const { user, signOut } = useContext(AuthContext);
    const [isOpenHireMeModal, setIsOpenHireMeModal] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const navigate = useNavigate();

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

    return (
        <div className="container">
            {!!user && (
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
                <nav className={s.nav} id="nav">
                    {dataNavLink(!!user).map((data, id) => {
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
                                        onClick={async () => {
                                            if (data.name === "LogOut") {
                                                await handleLogoutClick(
                                                    navigate,
                                                    signOut
                                                );
                                            }
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
                                            s.nav__link + " " + s.nav__link_btn
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
                    })}
                </nav>
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
