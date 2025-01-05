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

export type TechnologyCategory =
    | "languages"
    | "frameworks"
    | "databases"
    | "authentication"
    | "orm"
    | "testing"
    | "deployment"
    | "libraries"
    | "bundlers"
    | "packageManagers"
    | "buildTools"
    | "stateManagement"
    | "routing"
    | "httpClients"
    | "cssPreprocessors"
    | "versionControl"
    | "codeEditors"
    | "designTools";

export type Technologies = {
    [key in TechnologyCategory]: string[];
} & {
    [key: string]: string[];
};

export interface ITechnologyStack {
    frontend: Technologies[];
    backend: Technologies[];
}
