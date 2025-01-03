import LoaderImg from "../../images/loader.svg";
import "./Loader.scss";

type LoaderProps = {
    loading?: "hidden" | "failed";
};

const Loader = ({ loading }: LoaderProps) => {
    return (
        <div className="loader" data-loading={loading}>
            <img className="loader__img" src={LoaderImg} alt="loader circle" />
            <span className="loader__text">Loading...</span>
        </div>
    );
};

export default Loader;
