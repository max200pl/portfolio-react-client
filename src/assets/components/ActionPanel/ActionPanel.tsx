import { Fade } from "react-awesome-reveal";
import { ReactComponent as PlusImage } from "../../images/plus.svg";
import editIcon from "../../images/intro/edit.svg";
import s from "./ActionPanel.module.scss";
import { ReactNode, useEffect, useState } from "react";

interface ActionPanelProps {
    onClickPluseButton: () => void;
    getStatusEditSection: (status: boolean) => void;
    children: ReactNode;
}

const ActionPanel: React.FC<ActionPanelProps> = ({
    onClickPluseButton,
    getStatusEditSection,
    children,
}) => {
    const [editSection, setEditSection] = useState<boolean>(false);

    useEffect(() => {
        getStatusEditSection(editSection);
    }, [editSection, getStatusEditSection]);

    return (
        <div className={s.action_panel}>
            <div className={s.action_panel__filter}>{children}</div>

            <div className={s.action_panel__edit_section}>
                {editSection && (
                    <Fade triggerOnce={true} direction="right">
                        <button
                            onClick={() => onClickPluseButton()}
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
