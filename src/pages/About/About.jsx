import { useState } from "react";
import s from "./About.module.scss";
import Modal from "../../assets/components/Modal/Modal";
import ModalHireMe from "../../modals/ModalHireMe/ModalHireMe";
import ModalSeeMyResume from "../../modals/ModalSeeMyResume/ModalSeeMyResume";
import SectionTitle from "../../assets/components/SectionTitle/SectionTitle";

//import aboutPhoto from "../../img/About__me/about__photo.png";

const About = () => {
    const [isOpenHireMeModal, setIsOpenHireMeModal] = useState(false);
    const [isOpenResumeModal, setIsOpenSeeMyResumeModal] = useState(false);

    return (
        <section className={s.about}>
            <div className="container">
                <div className={s.about__content}>
                    <SectionTitle text="Who Am I ?" />

                    <div className={s.about__text}>
                        <h3 className={s.about__title}>About me</h3>
                        <p className={s.about__description}>
                            Hello! I'm Maksym, a full-stack web developer with a
                            passion for creating engaging and efficient digital
                            solutions.
                        </p>
                        <h3 className={s.about__title}>
                            Background and Experience
                        </h3>
                        <p className={s.about__description}>
                            I hold a degree in a technical field and have honed
                            my skills through diverse experiences in both
                            outsourcing firms and a major product company,
                            Avanquest. My journey has taken me from front-end
                            development, focusing on visual web and desktop
                            applications, to becoming a full-stack developer.
                            This transition has allowed me to broaden my
                            expertise and contribute to projects from inception
                            to deployment.
                        </p>
                        <h3 className={s.about__title}>Technical Expertise</h3>
                        <p className={s.about__description}>
                            My toolkit includes a range of technologies, but I
                            have a particular affinity for React, which I find
                            to be the most versatile library for building
                            dynamic applications. I've also leveraged the
                            Sciter.js framework to craft intuitive desktop
                            application interfaces. In addition to web
                            development, I have ventured into projects involving
                            Arduino, further expanding my technical repertoire.
                        </p>
                        <h3 className={s.about__title}>
                            Professional Philosophy
                        </h3>
                        <p className={s.about__description}>
                            I am driven by a commitment to self-improvement and
                            a relentless pursuit of professional growth in the
                            IT industry. I thrive on creating new and innovative
                            solutions and am constantly seeking out
                            opportunities to evolve as a developer.
                        </p>
                        <h3 className={s.about__title}>Future Aspirations</h3>
                        <p className={s.about__description}>
                            Looking ahead, I am excited to deepen my expertise
                            in full-stack development, exploring new
                            technologies and methodologies that enhance my
                            ability to deliver robust and scalable solutions. My
                            ultimate goal is to continue learning, growing, and
                            contributing to projects that make a meaningful
                            impact.
                        </p>
                    </div>

                    <div className={s.about__footer}>
                        <button
                            className={"btn"}
                            onClick={() => setIsOpenHireMeModal(true)}
                        >
                            Hire Me
                        </button>
                        <button
                            className={"btn"}
                            onClick={() => setIsOpenSeeMyResumeModal(true)}
                        >
                            See My Resume
                        </button>
                    </div>
                </div>
            </div>

            <Modal
                handleClose={() => {
                    setIsOpenHireMeModal(false);
                }}
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

export default About;
