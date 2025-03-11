import s from "./AccessDenied.module.scss";

interface IAccessDeniedProps {
    onClick: () => void;
}

export const WorksAccessDenied = ({ onClick }: IAccessDeniedProps) => {
    return (
        <div className={s.access_denied}>
            <h2>🔒 Exclusive Projects Await</h2>
            <p>
                Get a closer look at my best work, featuring real-world projects
                and innovative solutions.
            </p>
            <p>Sign in to explore my portfolio in full detail.</p>
            <button
                className={"btn"}
                onClick={() => {
                    onClick();
                }}
            >
                Sign In to Unlock
            </button>
        </div>
    );
};

export const CertificatesAccessDenied = ({ onClick }: IAccessDeniedProps) => {
    return (
        <div className={s.access_denied}>
            <h2>🔒 Unlock Full Access</h2>
            <p>
                My certifications showcase my expertise and commitment to
                continuous learning.
            </p>
            <p>Sign in to explore my full list of achievements.</p>
            <button
                className={"btn"}
                onClick={() => {
                    onClick();
                }}
            >
                Sign In to Unlock
            </button>
        </div>
    );
};
