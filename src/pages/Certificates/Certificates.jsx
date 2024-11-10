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
import { getCertificateCategoryNames } from "./Certificats.hepers";

const Certificates = () => {
    const [isOpenHireMeModal, setIsOpenHireMeModal] = useState(false);
    const [isOpenResumeModal, setIsOpenSeeMyResumeModal] = useState(false);
    const [isOpenEditCertificateModal, toggleEditCertificateOpenModal] =
        useState(false);
    const [currentCertificate, setCurrentCertificate] = useState({});
    const [filter, setFilter] = useState("All");
    const {
        status,
        data: certificates,
        isLoading,
    } = useGetCertificatesQuery(filter);

    const {
        status: statusCategories,
        data: categories = [],
        isLoading: isLoadingCategories,
    } = useGetCategoriesCertificatesQuery();

    const nameCategories = getCertificateCategoryNames(categories);
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
                        toggleEditCertificateOpenModal(true);
                    }}
                >
                    {statusCategories === "success" && (
                        <Filter
                            onFilterChange={setFilter}
                            categories={nameCategories}
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
                                {certificates?.map((work, id) => {
                                    return (
                                        <div
                                            key={work.name}
                                            className={s.card__col}
                                        >
                                            <LazyLoadComponent>
                                                <Certificate
                                                    {...work}
                                                    key={work.name}
                                                    editSection={editSection}
                                                    onClickEditWork={() => {
                                                        setCurrentCertificate(
                                                            work
                                                        );
                                                        toggleEditCertificateOpenModal(
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
                handleClose={() => toggleEditCertificateOpenModal(false)}
                isOpen={isOpenEditCertificateModal}
            >
                <ModalCertificateManager
                    onClose={toggleEditCertificateOpenModal}
                    certificate={currentCertificate}
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
