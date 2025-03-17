import { useContext, useEffect, useState } from "react";
import s from "./Works.module.scss";
import Modal from "../../assets/components/Modal/Modal";
import ModalHireMe from "../../modals/ModalHireMe/ModalHireMe";
import ModalSeeMyResume from "../../modals/ModalSeeMyResume/ModalSeeMyResume";
import { Fade } from "react-awesome-reveal";
import { useGetWorksQuery } from "../../assets/api/works.api";
import ModalWork from "../../modals/ModalWork/ModalWork";
import ModalWorkManager from "../../modals/ModalWorkManager/ModalWorkManager";
import SectionTitle from "../../assets/components/SectionTitle/SectionTitle";
import ActionPanel from "../../assets/components/ActionPanel/ActionPanel";
import Filter from "../../assets/components/Filter/Filter";
import { Category, IWork } from "../../assets/interfaces/NewInterfaces";
import { Work } from "./Work/Work";
import { LazyLoadComponent } from "react-lazy-load-image-component";
import { getUniqCategoriesWork } from "./Works.helpers";
import { Box, Grid, Skeleton } from "@mui/material";
import { AuthContext } from "../../context/auth-context";
import { WorksAccessDenied } from "../../assets/components/AccessDenied/AccessDenied";
import { useNavigate } from "react-router-dom";
import { logInfo } from "../../utils/loggingHelpers";
import DownloadCVButton from "../../components/DownloadCVButton/DownloadCVButton";

const Works = () => {
    const [isOpenHireMeModal, setIsOpenHireMeModal] = useState(false);
    const [isOpenResumeModal, setIsOpenSeeMyResumeModal] = useState(false);
    const [isOpenModal, toggleOpenModal] = useState(false);
    const [isOpenEditModal, toggleEditOpenModal] = useState(false);
    const [currentWork, setCurrentWork] = useState<IWork>();
    const [filter, setFilter] = useState<Category["_id"] | undefined>();
    const { user } = useContext(AuthContext);
    const {
        status,
        data: works,
        error,
    } = useGetWorksQuery(filter, {
        skip: !user,
    });
    const [editSection, setEditSection] = useState(false);
    const navigate = useNavigate();

    const [categoriesInitialized, setCategoriesInitialized] = useState(false);
    const [uniqueCategories, setUniqueCategories] = useState<Category[]>([]);

    useEffect(() => {
        if (status === "success" && works && !categoriesInitialized) {
            const categories = getUniqCategoriesWork(works);
            setUniqueCategories(categories);
            setCategoriesInitialized(true);
        } else if (status === "error") {
            setCategoriesInitialized(false);
        }
    }, [status, works, categoriesInitialized, error]);

    return (
        <section className={s.works}>
            <div className="container">
                <SectionTitle text="My Works" />

                <ActionPanel
                    isShowEditButton={!!user?.roles.includes("admin")}
                    getStatusEditSection={(status) => {
                        !!user && setEditSection(status);
                    }}
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
                <div className={s.grid_container}>
                    {!user ? (
                        <WorksAccessDenied
                            onClick={() => {
                                logInfo("[AccessDenied] onClick");
                                navigate("/auth/login");
                            }}
                        />
                    ) : null}
                    {((!works && user) || !user) && (
                        <>
                            <Grid
                                sx={{
                                    markerEnd: "15px",
                                    filter: !user ? "blur(5px)" : "none", // Add blur effect if no user
                                }}
                                container
                                wrap="wrap"
                                boxSizing={"border-box"}
                            >
                                {new Array(6).fill(0).map((_, index) => (
                                    <Box
                                        key={index}
                                        flexBasis={[
                                            "100%",
                                            "50%",
                                            "50%",
                                            "33.333%",
                                        ]}
                                        sx={{
                                            my: 0,
                                        }}
                                    >
                                        <Box
                                            display={"flex"}
                                            flexDirection={"column"}
                                            justifyContent={"space-between"}
                                            sx={{
                                                margin: "15px",
                                            }}
                                        >
                                            <Skeleton
                                                width="100%"
                                                animation={
                                                    !user ? "wave" : "pulse"
                                                }
                                                sx={{
                                                    height: "330px",
                                                    transform: "scale(1)",
                                                }}
                                            />
                                            <Skeleton
                                                height="60px"
                                                width="60%"
                                                animation={
                                                    !user ? "wave" : "pulse"
                                                }
                                            />
                                        </Box>
                                    </Box>
                                ))}
                            </Grid>
                        </>
                    )}
                </div>
                {status === "success" && user && (
                    <div className={s.works_container}>
                        <Fade
                            triggerOnce={true}
                            direction="right"
                            cascade
                            className={s.works_container__col}
                        >
                            {works?.map((work, id) => {
                                return (
                                    <div
                                        key={work.name}
                                        className={s.works_container__col}
                                    >
                                        <LazyLoadComponent>
                                            <Work
                                                work={work}
                                                key={String(work._id)}
                                                editSection={editSection}
                                                onClickEditWork={() => {
                                                    setCurrentWork(work);
                                                    toggleEditOpenModal(true);
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
                )}

                <div className={s.works__footer}>
                    <button
                        className={"btn"}
                        onClick={() => setIsOpenHireMeModal(true)}
                    >
                        Hire Me
                    </button>
                    {/* <button
                        className={"btn"}
                        onClick={() => setIsOpenSeeMyResumeModal(true)}
                    >
                        See My Resume
                    </button> */}
                    <DownloadCVButton />
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
