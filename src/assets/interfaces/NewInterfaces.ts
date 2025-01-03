interface WorkUniqueId {
    $oid: string;
}

interface SlideUniqueId {
    $oid: string;
}

interface CategoryUniqueId {
    $oid: string;
}

interface Tech {
    name: string;
    apply: number;
}

interface Image {
    blurHash: string;
    url: string;
    destination: string;
    size: number;
}

export interface Category {
    _id: CategoryUniqueId;
    label: string;
    description?: string;
}

export interface IWork {
    _id: WorkUniqueId;
    name: string;
    dateFinished: Date;
    category: Category;
    client?: string;
    link?: string;
    frontTech?: {
        [key: string]: Tech[];
    };
    backTech?: {
        [key: string]: Tech[];
    };
    cardImage?: Image;
    slides?: SlideUniqueId[];
}
