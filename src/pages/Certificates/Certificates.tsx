import { useState } from "react";
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
import { getCertificateCategoryNames } from "./Certificates.helpers";
import { Category, ICertificate } from "../../assets/interfaces/NewInterfaces";

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

    return (
        <section className={s.certificates}>
            <div className="container">
                <SectionTitle text="Certifications" />

                {isLoading && <Loader />}

                <ActionPanel
                    getStatusEditSection={(status) => setEditSection(status)}
                    onClickPluseButton={() => {
                        setCurrentCertificate(undefined);
                        toggleEditOpenModal(true);
                    }}
                >
                    {statusCategories === "success" && (
                        <Filter
                            currentFilter={filter}
                            onFilterChange={setFilter}
                            categories={categories}
                        />
                    )}
                </ActionPanel>

                {status === "success" && certificates.length && (
                    <div className={s.card}>
                        <div className={s.card__container}>
                            <Fade
                                triggerOnce={true}
                                direction="right"
                                cascade
                                className={s.card__col}
                            >
                                {certificates?.map((certificate, id) => {
                                    return (
                                        <div
                                            key={certificate.name}
                                            className={s.card__col}
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
                                                        toggleEditOpenModal(
                                                            true
                                                        );
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
            {/*
            <Modal
                handleClose={() => {
                    setIsOpenHireMeModal(false);
                }}
                isOpen={() => isOpenHireMeModal(false)}
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
            </Modal> */}
        </section>
    );
};

export default Certificates;
