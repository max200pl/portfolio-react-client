import {
    getCertificateCategoryNames,
    getUniqCategoriesCertificates,
} from "./Certificates.helpers";
import { CertificateCategory, ICertificate } from "../../assets/interfaces/NewInterfaces";

const mockCertificates: ICertificate[] = [
    {
        _id: "1",
        name: "React Advanced",
        category: { _id: "cat1", label: "Frontend" },
    },
    {
        _id: "2",
        name: "Node.js Basics",
        category: { _id: "cat2", label: "Backend" },
    },
    {
        _id: "3",
        name: "React Fundamentals",
        category: { _id: "cat1", label: "Frontend" }, // дубль категории
    },
];

describe("getUniqCategoriesCertificates", () => {
    test("returns unique categories from certificates", () => {
        const result = getUniqCategoriesCertificates(mockCertificates);
        expect(result).toHaveLength(2);
        expect(result.map((c) => c._id)).toEqual(["cat1", "cat2"]);
    });

    test("returns empty array for empty input", () => {
        expect(getUniqCategoriesCertificates([])).toEqual([]);
    });

    test("returns single category when all certificates have same category", () => {
        const certs: ICertificate[] = [
            { _id: "1", name: "A", category: { _id: "cat1", label: "Frontend" } },
            { _id: "2", name: "B", category: { _id: "cat1", label: "Frontend" } },
        ];
        const result = getUniqCategoriesCertificates(certs);
        expect(result).toHaveLength(1);
        expect(result[0].label).toBe("Frontend");
    });

    test("skips certificates without category", () => {
        const certs = [
            { _id: "1", name: "A", category: null as any },
        ];
        const result = getUniqCategoriesCertificates(certs);
        expect(result).toEqual([]);
    });
});

describe("getCertificateCategoryNames", () => {
    const mockCategories: CertificateCategory[] = [
        { _id: "cat1", label: "Frontend" },
        { _id: "cat2", label: "Backend" },
        { _id: "cat3", label: "DevOps" }, // нет сертификатов в этой категории
    ];

    test("returns names of categories that have certificates", () => {
        const result = getCertificateCategoryNames(mockCategories, mockCertificates);
        expect(result).toEqual(["Frontend", "Backend"]);
        expect(result).not.toContain("DevOps");
    });

    test("returns empty array when no certificates", () => {
        const result = getCertificateCategoryNames(mockCategories, []);
        expect(result).toEqual([]);
    });

    test("returns empty array when no categories", () => {
        const result = getCertificateCategoryNames([], mockCertificates);
        expect(result).toEqual([]);
    });

    test("returns empty array when both args are null/undefined", () => {
        expect(getCertificateCategoryNames(null as any, null as any)).toEqual([]);
    });
});
