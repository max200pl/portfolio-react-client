import s from "./AccessDenied.module.scss";

interface IAccessDeniedProps {
    onClick: () => void;
}

export const AccessDenied = ({ onClick }: IAccessDeniedProps) => {
    return (
        <div className={s.access_denied}>
            <h2>🔒 Exclusive Access</h2>
            <p>Unlock my portfolio to explore my best work.</p>
            <button
                className={"btn"}
                onClick={() => {
                    onClick();
                }}
            >
                Sign In to Continue
            </button>
        </div>
    );
};
