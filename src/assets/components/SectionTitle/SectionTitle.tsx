import s from "./SectionTitle.module.scss";
const SectionTitle = ({ text }: { text: string }) => {
    return <h2 className={s.title}>{text}</h2>;
};

export default SectionTitle;
