interface Tech {
    name: string;
    apply: number;
}

export interface ITech {
    [key: string]: Tech[];
}

interface Image {
    blurHash: string;
    url: string;
    destination: string;
    size: number;
}

export interface Category {
    _id: string;
    label: string;
    description?: string;
}

export interface IWork {
    _id: string;
    name: string;
    dateFinished: Date;
    category: Category;
    client?: string;
    link?: string;
    frontTech?: ITech;
    backTech?: ITech;
    cardImage?: Image;
    slides?: string[];
}
