import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import React from "react";
import Certificates from "./Certificates";
import { AuthContext } from "../../context/auth-context";
import { ICertificate } from "../../assets/interfaces/NewInterfaces";

// ─── Моки ────────────────────────────────────────────────────────────────────

// Мокаем целиком — иначе Jest тянет axios (ESM) и падает
const mockUseGetCertificatesQuery = jest.fn();
const mockUseGetCategoriesCertificatesQuery = jest.fn();

jest.mock("../../assets/api/certificates.api", () => ({
    useGetCertificatesQuery: (...args: any[]) => mockUseGetCertificatesQuery(...args),
    useGetCategoriesCertificatesQuery: (...args: any[]) => mockUseGetCategoriesCertificatesQuery(...args),
}));

jest.mock("react-awesome-reveal", () => ({
    Fade: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock("react-lazy-load-image-component", () => ({
    LazyLoadComponent: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock("../../assets/components/ImageLazyLoad/ImageLazyLoad", () => ({
    __esModule: true,
    default: ({ url }: { url: string }) => <img src={url} alt="cert" />,
}));

jest.mock("../../components/DownloadCVButton/DownloadCVButton", () => ({
    __esModule: true,
    default: () => <button>Download CV</button>,
}));

// Мокаем auth-context целиком — иначе тянет auth.api → axios (ESM)
jest.mock("../../context/auth-context", () => {
    const React = require("react");
    return { AuthContext: React.createContext(null) };
});

// ─── Фикстуры ─────────────────────────────────────────────────────────────────

const mockCertificates: ICertificate[] = [
    { _id: "1", name: "React Advanced Course", category: { _id: "cat1", label: "Frontend" } },
    { _id: "2", name: "Node.js Fundamentals", category: { _id: "cat2", label: "Backend" } },
];

const mockUser = {
    email: "test@test.com",
    firstName: "Test",
    lastName: "User",
    fullName: "Test User",
    displayName: "Test User",
    photoURL: null,
    roles: ["user"] as string[],
    settings: { theme: "light" as const, language: "en" },
};

const mockAuthContext: any = {
    user: mockUser,
    loading: false,
    signInWithForm: jest.fn(),
    signUpWithForm: jest.fn(),
    signInWithGoogle: jest.fn(),
    signInWithGitHub: jest.fn(),
    signOut: jest.fn(),
};

const noUserAuthContext: any = { ...mockAuthContext, user: null };

// ─── Хелпер рендера ───────────────────────────────────────────────────────────

const renderCertificates = (authValue = mockAuthContext) =>
    render(
        <MemoryRouter>
            <AuthContext.Provider value={authValue}>
                <Certificates />
            </AuthContext.Provider>
        </MemoryRouter>
    );

// ─── Тесты ───────────────────────────────────────────────────────────────────

describe("Certificates page", () => {
    beforeEach(() => {
        mockUseGetCategoriesCertificatesQuery.mockReturnValue({ status: "success", data: [] });
    });

    afterEach(() => jest.clearAllMocks());

    describe("общий UI", () => {
        test('показывает заголовок "Certifications"', () => {
            mockUseGetCertificatesQuery.mockReturnValue({ status: "loading", data: undefined });
            renderCertificates();
            expect(screen.getByText("Certifications")).toBeInTheDocument();
        });

        test('показывает кнопку "Hire Me"', () => {
            mockUseGetCertificatesQuery.mockReturnValue({ status: "loading", data: undefined });
            renderCertificates();
            expect(screen.getByRole("button", { name: "Hire Me" })).toBeInTheDocument();
        });
    });

    describe("без авторизации", () => {
        beforeEach(() => {
            mockUseGetCertificatesQuery.mockReturnValue({ status: "loading", data: undefined });
        });

        test("показывает skeleton-заглушки", () => {
            renderCertificates(noUserAuthContext);
            const skeletons = document.querySelectorAll(".MuiSkeleton-root");
            expect(skeletons.length).toBeGreaterThan(0);
        });

        test("не показывает сертификаты", () => {
            renderCertificates(noUserAuthContext);
            expect(screen.queryByText("React Advanced Course")).not.toBeInTheDocument();
        });
    });

    describe("с авторизацией — загрузка", () => {
        test("показывает skeleton пока данные загружаются", () => {
            mockUseGetCertificatesQuery.mockReturnValue({ status: "loading", data: undefined });
            renderCertificates();
            const skeletons = document.querySelectorAll(".MuiSkeleton-root");
            expect(skeletons.length).toBeGreaterThan(0);
        });
    });

    describe("с авторизацией — данные загружены", () => {
        beforeEach(() => {
            mockUseGetCertificatesQuery.mockReturnValue({ status: "success", data: mockCertificates });
        });

        test("показывает все сертификаты", () => {
            renderCertificates();
            expect(screen.getByText("React Advanced Course")).toBeInTheDocument();
            expect(screen.getByText("Node.js Fundamentals")).toBeInTheDocument();
        });

        test("показывает категории сертификатов", () => {
            renderCertificates();
            expect(screen.getAllByText("Frontend").length).toBeGreaterThan(0);
            expect(screen.getAllByText("Backend").length).toBeGreaterThan(0);
        });

        test("не показывает skeleton после загрузки", () => {
            renderCertificates();
            const skeletons = document.querySelectorAll(".MuiSkeleton-root");
            expect(skeletons.length).toBe(0);
        });
    });

    describe("модалка Hire Me", () => {
        beforeEach(() => {
            mockUseGetCertificatesQuery.mockReturnValue({ status: "success", data: mockCertificates });
        });

        test('открывает модалку по клику на "Hire Me"', () => {
            renderCertificates();
            fireEvent.click(screen.getByRole("button", { name: "Hire Me" }));
            expect(screen.getByText("Let's talk!")).toBeInTheDocument();
        });
    });
});
