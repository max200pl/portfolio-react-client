import { useState } from "react";
import s from "./Works.module.scss";
import Modal from "../../assets/components/Modal/Modal";
import ModalHireMe from "../../modals/ModalHireMe/ModalHireMe";
import ModalSeeMyResume from "../../modals/ModalSeeMyResume/ModalSeeMyResume";
import { Fade } from "react-awesome-reveal";
import { LazyLoadComponent } from "react-lazy-load-image-component";
import { useGetWorksQuery } from "../../assets/api/works.api";
import ModalWork from "../../modals/ModalWork/ModalWork";
import ModalWorkManager from "../../modals/ModalWorkManager/ModalWorkManager";
import SectionTitle from "../../assets/components/SectionTitle/SectionTitle";
import ActionPanel from "../../assets/components/ActionPanel/ActionPanel";
import { Work } from "./Work/Work";
import Loader from "../../assets/components/Loader/Loader";

const Works = () => {
    const [isOpenHireMeModal, setIsOpenHireMeModal] = useState(false);
    const [isOpenResumeModal, setIsOpenSeeMyResumeModal] = useState(false);
    const [isOpenModal, toggleOpenModal] = useState(false);
    const [isOpenEditWorkModal, toggleEditWorkOpenModal] = useState(false);
    const [currentWork, setCurrentWork] = useState({});
    const [filter, setFilter] = useState("All");
    const { status, data: works, isLoading } = useGetWorksQuery(filter);
    const [editSection, setEditSection] = useState(false);

    return (
        <section className={s.works}>
            <div className="container">
                <SectionTitle text="My Works" />
                {isLoading && <Loader />}
                <ActionPanel
                    toggleEditWorkOpenModal={toggleEditWorkOpenModal}
                    getCurrentFilter={(filter) => setFilter(filter)}
                    getStatusEditSection={(status) => setEditSection(status)}
                    setCurrentWork={(work) => setCurrentWork(work)}
                />

                {status === "success" && (
                    <div className={s.card}>
                        <div className={s.card__container}>
                            <Fade
                                triggerOnce={true}
                                direction="right"
                                cascade
                                className={s.card__col}
                            >
                                {works?.map((work, id) => {
                                    return (
                                        <div
                                            key={work.name}
                                            className={s.card__col}
                                        >
                                            <LazyLoadComponent>
                                                <Work
                                                    {...work}
                                                    key={work.name}
                                                    editSection={editSection}
                                                    onClickEditWork={() => {
                                                        setCurrentWork(work);
                                                        toggleEditWorkOpenModal(
                                                            true
                                                        );
                                                    }}
                                                    onCardClick={() => {
                                                        setCurrentWork(work);
                                                        toggleOpenModal(true);
                                                    }}
                                                />
                                            </LazyLoadComponent>
                                        </div>
                                    );
                                })}
                            </Fade>
                        </div>
                    </div>
                )}

                <div className={s.works__footer}>
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

            <Modal
                handleClose={() => toggleOpenModal(false)}
                isOpen={isOpenModal}
            >
                <ModalWork onClose={toggleOpenModal} work={currentWork} />
            </Modal>

            <Modal
                handleClose={() => toggleEditWorkOpenModal(false)}
                isOpen={isOpenEditWorkModal}
            >
                <ModalWorkManager
                    onClose={toggleEditWorkOpenModal}
                    work={currentWork}
                />
            </Modal>

            <Modal
                handleClose={() => {
                    setIsOpenHireMeModal(false);
                }}
                isOpen={isOpenHireMeModal}
            >
                <ModalHireMe onClose={() => setIsOpenHireMeModal(false)} />
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

export default Works;
