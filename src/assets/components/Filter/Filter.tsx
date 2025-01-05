import { Category } from "../../interfaces/NewInterfaces";
import s from "./Filter.module.scss";

interface FilterProps {
    currentFilter: Category["_id"] | undefined;
    onFilterChange: (filter: Category["_id"] | undefined) => void;
    categories: Category[] | undefined;
}

export const Filter = ({
    onFilterChange,
    categories,
    currentFilter,
}: FilterProps) => {
    return (
        <div className={s.filter}>
            <button
                data-active={!currentFilter}
                onClick={() => onFilterChange(undefined)}
                className={s.filter__button}
            >
                All
            </button>
            {categories?.map((category, id) => (
                <button
                    data-active={category._id === currentFilter}
                    key={id}
                    onClick={() => onFilterChange(category._id)}
                    className={s.filter__button}
                >
                    {category.label}
                </button>
            ))}
        </div>
    );
};

export default Filter;
