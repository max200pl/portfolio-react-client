import s from "./Filter.module.scss";

interface FilterProps {
    onFilterChange: (filter: { category: string }) => void;
    categories: string[];
}

export const Filter = ({ onFilterChange, categories }: FilterProps) => {
    return (
        <div className={s.filter}>
            <button
                onClick={() => onFilterChange({ category: "" })}
                className={s.filter__button}
            >
                All
            </button>
            {categories.map((category, id) => (
                <button
                    key={id}
                    onClick={() => onFilterChange({ category })}
                    className={s.filter__button}
                >
                    {category}
                </button>
            ))}
        </div>
    );
};

export default Filter;
