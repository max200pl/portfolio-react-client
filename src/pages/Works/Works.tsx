import { useState } from "react";
import s from "./Works.module.scss";
import Modal from "../../assets/components/Modal/Modal";
import ModalHireMe from "../../modals/ModalHireMe/ModalHireMe";
import ModalSeeMyResume from "../../modals/ModalSeeMyResume/ModalSeeMyResume";
import { Fade } from "react-awesome-reveal";
import {
    useGetCategoriesWorksQuery,
    useGetWorksQuery,
} from "../../assets/api/works.api";
import ModalWork from "../../modals/ModalWork/ModalWork";
import ModalWorkManager from "../../modals/ModalWorkManager/ModalWorkManager";
import SectionTitle from "../../assets/components/SectionTitle/SectionTitle";
import ActionPanel from "../../assets/components/ActionPanel/ActionPanel";
import Loader from "../../assets/components/Loader/Loader";
import Filter from "../../assets/components/Filter/Filter";
import { extractUniqueCategories, handleTechUpdate } from "./Works.helpers";
import { Category, IWork } from "../../assets/interfaces/NewInterfaces";
import { Work } from "./Work/Work";
import { LazyLoadComponent } from "react-lazy-load-image-component";

const Works = () => {
    const [isOpenHireMeModal, setIsOpenHireMeModal] = useState(false);
    const [isOpenResumeModal, setIsOpenSeeMyResumeModal] = useState(false);
    const [isOpenModal, toggleOpenModal] = useState(false);
    const [isOpenEditWorkModal, toggleEditWorkOpenModal] = useState(false);
    const [currentWork, setCurrentWork] = useState<IWork>();
    const [filter, setFilter] = useState<Category["_id"] | undefined>();
    const { status, data: works, isLoading } = useGetWorksQuery(filter);
    const [editSection, setEditSection] = useState(false);

    const { status: statusCategories, data: categories } =
        useGetCategoriesWorksQuery();

    const uniqueCategories = extractUniqueCategories(categories, works);

    return (
        <section className={s.works}>
            <div className="container">
                <SectionTitle text="My Works" />
                {isLoading && <Loader />}
                <ActionPanel
                    getStatusEditSection={(status) => setEditSection(status)}
                    onClickPluseButton={() => {
                        setCurrentWork(undefined);
                        toggleEditWorkOpenModal(true);
                    }}
                >
                    {statusCategories === "success" && (
                        <Filter
                            onFilterChange={setFilter}
                            categories={uniqueCategories}
                        />
                    )}
                </ActionPanel>

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
                                                    work={work}
                                                    key={String(work._id)}
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
                    work={currentWork as IWork}
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
