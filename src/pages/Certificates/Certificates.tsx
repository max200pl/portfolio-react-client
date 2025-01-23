import { useState, useEffect } from "react";
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
import Loader from "../../assets/components/Loader/Loader";
import ModalCertificateManager from "../../modals/ModalCertificateManager/ModalCertificateManager";
import Filter from "../../assets/components/Filter/Filter";
import { Category, ICertificate } from "../../assets/interfaces/NewInterfaces";
import { getUniqCategoriesCertificates } from "./Certificates.helpers";
import { Box, Grid, Skeleton } from "@mui/material";

const Certificates = () => {
    const [isOpenHireMeModal, setIsOpenHireMeModal] = useState(false);
    const [isOpenResumeModal, setIsOpenSeeMyResumeModal] = useState(false);
    const [isOpenEditModal, toggleEditOpenModal] = useState(false);
    const [currentCertificate, setCurrentCertificate] =
        useState<ICertificate>();

    const [filter, setFilter] = useState<Category["_id"] | undefined>();

    const {
        status,
        data: certificates,
        isLoading,
    } = useGetCertificatesQuery(filter);

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
        }
    }, [categories, categoriesInitialized, certificates, statusCategories]);

    return (
        <section className={s.certificates}>
            <div className="container">
                <SectionTitle text="Certifications" />

                {!certificates && (
                    <>
                        <Grid
                            sx={{
                                markerEnd: "15px",
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
                                        "100%",
                                        "33.333%",
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
                                        width={[
                                            "100%",
                                            "370px",
                                            "33.333%",
                                            "33.333%",
                                        ]}
                                        sx={{
                                            margin: [
                                                "15px auto",
                                                "15px auto",
                                                "15px",
                                                "15px",
                                            ],
                                            my: 0,
                                        }}
                                    >
                                        <Skeleton height="330px" width="100%" />
                                        <Skeleton height="60px" width="60%" />
                                    </Box>
                                </Box>
                            ))}
                        </Grid>
                    </>
                )}

                <ActionPanel
                    getStatusEditSection={(status) => setEditSection(status)}
                    onClickPluseButton={() => {
                        setCurrentCertificate(undefined);
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

                {status === "success" && certificates.length ? (
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
                    <button
                        className={"btn"}
                        onClick={() => setIsOpenSeeMyResumeModal(true)}
                    >
                        See My Resume
                    </button>
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
