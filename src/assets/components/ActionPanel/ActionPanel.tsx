import { Fade } from "react-awesome-reveal";
import { ReactComponent as PlusImage } from "../../images/plus.svg";
import editIcon from "../../images/intro/edit.svg";
import s from "./ActionPanel.module.scss";
import { useGetCategoriesQuery } from "../../api/works.api";
import { getUniqCategories } from "../../helpers/helpers";
import Filter from "../Filter/Filter";
import { useEffect, useState } from "react";

interface ActionPanelProps {
    toggleEditWorkOpenModal: (isOpen: boolean) => void;
    setCurrentWork: (work: any | undefined) => void;
    getCurrentFilter: (filter: FilterState) => void;
    getStatusEditSection: (status: boolean) => void;
}

interface FilterState {
    category: string;
}

const ActionPanel: React.FC<ActionPanelProps> = ({
    toggleEditWorkOpenModal,
    setCurrentWork,
    getCurrentFilter,
    getStatusEditSection,
}) => {
    const [filter, setFilter] = useState<FilterState>({ category: "" });
    const [editSection, setEditSection] = useState<boolean>(false);

    const { status: statusCategories, data: categories } =
        useGetCategoriesQuery();

    const uniqCategoriesWork = getUniqCategories(categories);

    useEffect(() => {
        if (filter.category) {
            setEditSection(false);
        }
        getStatusEditSection(editSection);
        getCurrentFilter(filter);
    }, [editSection, filter, getCurrentFilter, getStatusEditSection]);

    return (
        <div className={s.action_panel}>
            <div className={s.action_panel__filter}>
                {statusCategories === "success" && (
                    <Filter
                        onFilterChange={setFilter}
                        categories={uniqCategoriesWork}
                    />
                )}
            </div>

            <div className={s.action_panel__edit_section}>
                {editSection && (
                    <Fade triggerOnce={true} direction="right">
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
                    className={s.action_panel__edit_section__button}
                    onClick={() => setEditSection(!editSection)}
                    type="button"
                >
                    <img
                        className={s.button__image}
                        src={editIcon}
                        alt="EditSection"
                    />
                </button>
            </div>
        </div>
    );
};

export default ActionPanel;
