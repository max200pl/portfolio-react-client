const DownloadCVButton = () => {
    return (
        <button
            className={"btn"}
            onClick={() => {
                window.open(
                    "https://www.canva.com/design/DAHCgtC_ySs/IOr8Hbyc66-9bc4n0L2YCg/view?utm_content=DAHCgtC_ySs&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h71c46c78c9",
                    "_blank"
                );
            }}
        >
            DOWNLOAD CV
        </button>
    );
};

export default DownloadCVButton;
