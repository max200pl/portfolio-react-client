const DownloadCVButton = () => {
    return (
        <button
            className={"btn"}
            onClick={() => {
                window.open(
                    "https://drive.google.com/file/d/1Kb5FRdToChpIsSvoVx1ACAMBvLz05Jw4/view?usp=sharing",
                    "_blank"
                );
            }}
        >
            DOWNLOAD CV
        </button>
    );
};

export default DownloadCVButton;
