import { useState, useEffect, useContext } from "react";
import s from "./Certificates.module.scss";
import Modal from "../../assets/components/Modal/Modal";
import ModalHireMe from "../../modals/ModalHireMe/ModalHireMe";
import ModalSeeMyResume from "../../modals/ModalSeeMyResume/ModalSeeMyResume";
import { Fade } from "react-awesome-reveal";
import { LazyLoadComponent } from "react-lazy-load-image-component";
import { Certificate } from "./Certificate/Certificate";
import SectionTitle from "../../assets/components/SectionTitle/SectionTitle";
import ActionPanel from "../../assets/components/ActionPanel/ActionPanel";
import {
    useGetCategoriesCertificatesQuery,
    useGetCertificatesQuery,
} from "../../assets/api/certificates.api";
import ModalCertificateManager from "../../modals/ModalCertificateManager/ModalCertificateManager";
import Filter from "../../assets/components/Filter/Filter";
import { Category, ICertificate } from "../../assets/interfaces/NewInterfaces";
import { getUniqCategoriesCertificates } from "./Certificates.helpers";
import { Box, Grid, Skeleton } from "@mui/material";
import { AuthContext } from "../../context/auth-context";
import { CertificatesAccessDenied } from "../../assets/components/AccessDenied/AccessDenied";
import { logInfo } from "../../utils/loggingHelpers";
import { useNavigate } from "react-router-dom";
import DownloadCVButton from "../../components/DownloadCVButton/DownloadCVButton";

const Certificates = () => {
    const [isOpenHireMeModal, setIsOpenHireMeModal] = useState(false);
    const [isOpenResumeModal, setIsOpenSeeMyResumeModal] = useState(false);
    const [isOpenEditModal, toggleEditOpenModal] = useState(false);
    const [currentCertificate, setCurrentCertificate] =
        useState<ICertificate>();

    const [filter, setFilter] = useState<Category["_id"] | undefined>();
    const { user } = useContext(AuthContext);
    const {
        status,
        data: certificates,
        error,
    } = useGetCertificatesQuery(filter, {
        skip: !user,
    });

    console.log("user?.roles.includes('admin')", user?.roles);

    const navigate = useNavigate();

    const { status: statusCategories, data: categories = [] } =
        useGetCategoriesCertificatesQuery();

    const [editSection, setEditSection] = useState(false);

    const [categoriesInitialized, setCategoriesInitialized] = useState(false);
    const [uniqueCategories, setUniqueCategories] = useState<Category[]>([]);

    useEffect(() => {
        if (
            statusCategories === "success" &&
            certificates &&
            !categoriesInitialized
        ) {
            const categories = getUniqCategoriesCertificates(certificates);
            setUniqueCategories(categories);
            setCategoriesInitialized(true);
        } else if (status === "error") {
            setCategoriesInitialized(false);
        }
    }, [
        categories,
        categoriesInitialized,
        certificates,
        statusCategories,
        error,
        status,
    ]);

    return (
        <section className={s.certificates}>
            <div className="container">
                <SectionTitle text="Certifications" />

                <ActionPanel
                    isShowEditButton={!!user?.roles.includes("admin")}
                    getStatusEditSection={(status) =>
                        !!user && setEditSection(status)
                    }
                    onClickPluseButton={() => {
                        setCurrentCertificate(undefined);
                        toggleEditOpenModal(true);
                    }}
                >
                    {categoriesInitialized && user && (
                        <Filter
                            currentFilter={filter}
                            onFilterChange={setFilter}
                            categories={uniqueCategories}
                        />
                    )}
                </ActionPanel>
                <div className={s.grid_container}>
                    {((!certificates && user) || !user) && (
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
                    {!user ? (
                        <CertificatesAccessDenied
                            onClick={() => {
                                logInfo("[AccessDenied] onClick");
                                navigate("/auth/login");
                            }}
                        />
                    ) : null}
                </div>
                {status === "success" && user ? (
                    <div className={s.certificates_container}>
                        <Fade
                            triggerOnce={true}
                            direction="right"
                            cascade
                            className={s.certificates_container__col}
                        >
                            {certificates?.map((certificate, id) => {
                                return (
                                    <div
                                        key={certificate.name}
                                        className={
                                            s.certificates_container__col
                                        }
                                    >
                                        <LazyLoadComponent>
                                            <Certificate
                                                certificate={certificate}
                                                key={certificate._id}
                                                editSection={editSection}
                                                onClickEditCertificate={() => {
                                                    setCurrentCertificate(
                                                        certificate
                                                    );
                                                    toggleEditOpenModal(true);
                                                }}
                                            />
                                        </LazyLoadComponent>
                                    </div>
                                );
                            })}
                        </Fade>
                    </div>
                ) : null}

                <div className={s.certificates__footer}>
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
                handleClose={() => toggleEditOpenModal(false)}
                isOpen={isOpenEditModal}
            >
                <ModalCertificateManager
                    onClose={() => toggleEditOpenModal(false)}
                    certificate={currentCertificate as ICertificate}
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

export default Certificates;
