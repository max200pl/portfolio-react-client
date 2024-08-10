import React, { useState } from "react";
import { Work as WorkComponent } from "./Work/Work";
import { Fade } from "react-awesome-reveal";
import s from "./Works.module.scss";
import FilterWorks from "./FilterWorks/FilterWorks";
import { getUniqCategoriesWork } from "../../../assets/helpers/helpers";
import ModalWork from "../../../modals/ModalWork/ModalWork";
import Modal from "../../../assets/components/Modal/Modal";
import { LazyLoadComponent } from "react-lazy-load-image-component";
import ModalWorkManager from "../../../modals/ModalWorkManager/ModalWorkManager";
import {
    useGetCategoriesQuery,
    useGetWorksQuery,
} from "../../../assets/api/works.api";

import editIcon from "../../../assets/images/intro/edit.svg";

import { ReactComponent as PlusImage } from "../../../assets/images/plus.svg";

const Works = () => {
    const [filter, setFilter] = useState({ category: "" });
    const { status, data: works } = useGetWorksQuery(filter);

    const { status: statusCategories, data: categories } =
        useGetCategoriesQuery();
    const uniqCategoriesWork = getUniqCategoriesWork(categories);

    const [isOpenModal, toggleOpenModal] = useState(false);
    const [isOpenEditWorkModal, toggleEditWorkOpenModal] = useState(false);
    const [currentWork, setCurrentWork] = useState({});
    const [editSection, setEditSection] = useState(false);

    return (
        <div className={s.portfolio} id="portfolio">
            <div className={s.portfolio__header}>
                <div className={s.portfolio__header_filter}>
                    {statusCategories === "success" && (
                        <FilterWorks
                            onFilterChange={setFilter}
                            categories={uniqCategoriesWork}
                        />
                    )}
                </div>

                <div className={s.portfolio__header_action_panel}>
                    {editSection && (
                        <Fade triggerOnce="true" direction="right">
                            <button
                                onClick={() => {
                                    setCurrentWork(undefined);
                                    toggleEditWorkOpenModal(true);
                                }}
                                type="button"
                            >
                                <PlusImage className={s.work_add__image_plus} />
                            </button>
                        </Fade>
                    )}

                    <button
                        className={s.portfolio__header_edit_button}
                        onClick={() => setEditSection(!editSection)}
                        type="button"
                    >
                        <img
                            className={s.button__image}
                            src={editIcon}
                            alt="Close"
                        />
                    </button>
                </div>
            </div>

            {status === "success" && (
                <div className={s.portfolio__container}>
                    <div className={s.portfolio__works}>
                        <Fade
                            triggerOnce="true"
                            direction="right"
                            cascade
                            className={s.portfolio__col}
                        >
                            {works?.map((work, id) => {
                                return (
                                    <div
                                        key={work.name}
                                        className={s.portfolio__col}
                                    >
                                        <LazyLoadComponent>
                                            <WorkComponent
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
        </div>
    );
};

export default Works;
