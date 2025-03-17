import React, { useState } from "react";
import ModalSeeMyResume from "../../modals/ModalSeeMyResume/ModalSeeMyResume";
import Modal from "../../assets/components/Modal/Modal";
import { SocialLinks } from "../../assets/components/SocialLinks/SocialLinks";
import s from "./Intro.module.scss";
import ModalHireMe from "../../modals/ModalHireMe/ModalHireMe";
import DownloadCVButton from "../../components/DownloadCVButton/DownloadCVButton";

const Intro = () => {
    const [isOpenHireMeModal, setIsOpenHireMeModal] = useState(false);
    const [isOpenResumeModal, setIsOpenSeeMyResumeModal] = useState(false);

    return (
        <section className={s.intro} id="hello">
            <div className="container">
                <div className={s.inner}>
                    <div className={s.content}>
                        <h2 className={s.subtitle}>Hello, I'm Maksym</h2>
                        <h1 className={s.title}>Full Stack Web Developer</h1>
                        <div className={s.text}>
                            <p>
                                Welcome to my portfolio!
                                <br />I specialize in building high-quality web
                                applications using the latest technologies.
                            </p>
                            <p>Let's create something amazing together!</p>
                        </div>
                        <div className={s.social}>
                            <SocialLinks />
                        </div>

                        <div className={s.link}>
                            <button
                                className={"btn"}
                                onClick={() => setIsOpenHireMeModal(true)}
                            >
                                Hire Me
                            </button>
                            <DownloadCVButton />
                            {/*
                            <button
                                className={"btn"}
                                onClick={() => setIsOpenSeeMyResumeModal(true)}
                            >
                                See My Resume
                            </button> */}
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                handleClose={() => setIsOpenHireMeModal(false)}
                isOpen={isOpenHireMeModal}
            >
                <ModalHireMe
                    onClose={() => setIsOpenHireMeModal(false)}
                    isOpen={isOpenHireMeModal}
                />
            </Modal>

            <Modal
                handleClose={() => setIsOpenSeeMyResumeModal(false)}
                isOpen={isOpenResumeModal}
            >
                <ModalSeeMyResume
                    handleClose={() => setIsOpenSeeMyResumeModal(false)}
                    isOpen={isOpenResumeModal}
                />
            </Modal>
        </section>
    );
};

export default Intro;
