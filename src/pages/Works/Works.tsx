import { useEffect, useState } from "react";
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
import { Category, IWork } from "../../assets/interfaces/NewInterfaces";
import { Work } from "./Work/Work";
import { LazyLoadComponent } from "react-lazy-load-image-component";
import { getUniqCategoriesWork } from "./Works.helpers";
import { Box, Grid, Skeleton } from "@mui/material";

const Works = () => {
    const [isOpenHireMeModal, setIsOpenHireMeModal] = useState(false);
    const [isOpenResumeModal, setIsOpenSeeMyResumeModal] = useState(false);
    const [isOpenModal, toggleOpenModal] = useState(false);
    const [isOpenEditModal, toggleEditOpenModal] = useState(false);
    const [currentWork, setCurrentWork] = useState<IWork>();
    const [filter, setFilter] = useState<Category["_id"] | undefined>();
    const { status, data: works, isLoading } = useGetWorksQuery(filter);
    const [editSection, setEditSection] = useState(false);

    const [categoriesInitialized, setCategoriesInitialized] = useState(false);
    const [uniqueCategories, setUniqueCategories] = useState<Category[]>([]);

    useEffect(() => {
        if (status === "success" && works && !categoriesInitialized) {
            const categories = getUniqCategoriesWork(works);
            setUniqueCategories(categories);
            setCategoriesInitialized(true);
        }
    }, [status, works, categoriesInitialized]);

    return (
        <section className={s.works}>
            <div className="container">
                <SectionTitle text="My Works" />

                <ActionPanel
                    getStatusEditSection={(status) => setEditSection(status)}
                    onClickPluseButton={() => {
                        setCurrentWork(undefined);
                        toggleEditOpenModal(true);
                    }}
                >
                    {categoriesInitialized && (
                        <Filter
                            currentFilter={filter}
                            onFilterChange={setFilter}
                            categories={uniqueCategories}
                        />
                    )}
                </ActionPanel>

                {!works && (
                    <>
                        <Loader />
                        <Grid container wrap="wrap" boxSizing={"border-box"}>
                            {new Array(6).fill(0).map((_, index) => (
                                <Box
                                    key={index}
                                    flexBasis={[
                                        "100%",
                                        "50%",
                                        "33.333%",
                                        "33.333%",
                                    ]}
                                    sx={{
                                        // margin: "15px",
                                        my: 0,
                                    }}
                                >
                                    <Box
                                        display={"flex"}
                                        flexDirection={"column"}
                                        justifyContent={"space-between"}
                                        flexBasis={["100%"]}
                                        sx={{
                                            margin: "15px",
                                            my: 0,
                                        }}
                                    >
                                        <Skeleton height="250px" width="100%" />
                                        <Skeleton width="60%" />
                                    </Box>
                                </Box>
                            ))}
                        </Grid>
                    </>
                )}
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
                                                        toggleEditOpenModal(
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
                <ModalWork
                    onClose={() => toggleOpenModal(false)}
                    work={currentWork}
                />
            </Modal>

            <Modal
                handleClose={() => toggleEditOpenModal(false)}
                isOpen={isOpenEditModal}
            >
                <ModalWorkManager
                    onClose={() => toggleEditOpenModal(false)}
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
