/**
 * Integration tests — Works page
 *
 * Difference from unit: real child components (Work, Filter, Modal, ModalWork, ModalHireMe).
 * We mock only external dependencies: API, Firebase, libraries incompatible with jsdom.
 *
 * Tested scenarios:
 *  - Display works list after loading
 *  - Click on card → opens ModalWork with work details
 *  - Close ModalWork → modal hides
 *  - Filter appears after data loading
 *  - Click on filter → API called with correct category
 *  - Open ModalHireMe via "Hire Me" button
 */

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import React from "react";
import { AuthContext } from "../../context/auth-context";
import Works from "./Works";
import { IWork } from "../../assets/interfaces/NewInterfaces";

// ─── External dependencies ────────────────────────────────────────────────────

const mockUseGetWorksQuery = jest.fn();

jest.mock("../../assets/api/works.api", () => ({
    useGetWorksQuery: (...args: any[]) => mockUseGetWorksQuery(...args),
    useUpdateWorkMutation: () => ({ mutate: jest.fn() }),
}));

jest.mock("../../context/auth-context", () => {
    const React = require("react");
    return { AuthContext: React.createContext(null) };
});

jest.mock("react-awesome-reveal", () => ({
    Fade: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock("react-lazy-load-image-component", () => ({
    LazyLoadComponent: ({ children }: { children: React.ReactNode }) => (
        <>{children}</>
    ),
}));

jest.mock("../../assets/components/ImageLazyLoad/ImageLazyLoad", () => ({
    __esModule: true,
    default: ({ url }: { url: string }) => <img src={url} alt="work" />,
}));

jest.mock("../../components/DownloadCVButton/DownloadCVButton", () => ({
    __esModule: true,
    default: () => <button>Download CV</button>,
}));

// ModalWorkManager — complex admin form, not needed in integration tests
jest.mock("../../modals/ModalWorkManager/ModalWorkManager", () => ({
    __esModule: true,
    default: () => <div>WorkManager</div>,
}));

// ModalSeeMyResume imports js-html2pdf which uses canvas — doesn't work in jsdom
jest.mock("../../modals/ModalSeeMyResume/ModalSeeMyResume", () => ({
    __esModule: true,
    default: () => <div>SeeMyResume</div>,
}));

// ─── Fixtures ────────────────────────────────────────────────────────────────

const mockWorks: IWork[] = [
    {
        _id: "w1",
        name: "Portfolio App",
        dateFinished: new Date("2023-05-01"),
        category: { _id: "cat1", label: "Frontend" },
        link: "https://github.com/portfolio",
        frontTech: { frameworks: [{ name: "React", apply: 1 }] },
    },
    {
        _id: "w2",
        name: "REST API Server",
        dateFinished: new Date("2023-08-15"),
        category: { _id: "cat2", label: "Backend" },
        link: "https://github.com/api-server",
    },
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

const renderWorks = (user: typeof mockUser | null = mockUser) => {
    const authValue: any = {
        user,
        loading: false,
        signInWithForm: jest.fn(),
        signUpWithForm: jest.fn(),
        signInWithGoogle: jest.fn(),
        signInWithGitHub: jest.fn(),
        signOut: jest.fn(),
    };

    return render(
        <MemoryRouter>
            <AuthContext.Provider value={authValue}>
                <Works />
            </AuthContext.Provider>
        </MemoryRouter>
    );
};

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("Works — integration tests", () => {
    afterEach(() => jest.clearAllMocks());

    // ── 1. Works list ────────────────────────────────────────────────────────

    describe("display works list", () => {
        beforeEach(() => {
            mockUseGetWorksQuery.mockReturnValue({
                status: "success",
                data: mockWorks,
            });
        });

        test("renders all work cards", () => {
            renderWorks();
            expect(screen.getByText("Portfolio App")).toBeInTheDocument();
            expect(screen.getByText("REST API Server")).toBeInTheDocument();
        });

        test("displays categories on cards", () => {
            renderWorks();
            expect(screen.getAllByText("Frontend").length).toBeGreaterThan(0);
            expect(screen.getAllByText("Backend").length).toBeGreaterThan(0);
        });

        test("displays completion years", () => {
            renderWorks();
            expect(screen.getAllByText("2023").length).toBeGreaterThan(0);
        });
    });

    // ── 2. Work card → ModalWork ──────────────────────────────────────────────

    describe("click on work card → ModalWork", () => {
        beforeEach(() => {
            mockUseGetWorksQuery.mockReturnValue({
                status: "success",
                data: mockWorks,
            });
        });

        test("opens ModalWork with work name", async () => {
            renderWorks();
            fireEvent.click(screen.getByText("Portfolio App"));

            await waitFor(() => {
                // ModalWork renders name through Fade
                expect(
                    screen.getAllByText("Portfolio App").length
                ).toBeGreaterThan(1);
            });
        });

        test("opens ModalWork with category and link", async () => {
            renderWorks();
            fireEvent.click(screen.getByText("Portfolio App"));

            await waitFor(() => {
                expect(
                    screen.getByRole("link", { name: "Link to work" })
                ).toHaveAttribute("href", "https://github.com/portfolio");
            });
        });

        test("shows Frontend technologies in ModalWork", async () => {
            renderWorks();
            fireEvent.click(screen.getByText("Portfolio App"));

            await waitFor(() => {
                expect(screen.getAllByText("Frontend").length).toBeGreaterThan(
                    0
                );
            });
        });

        test("closes ModalWork via Close button", async () => {
            renderWorks();
            fireEvent.click(screen.getByText("Portfolio App"));

            await waitFor(() => {
                expect(
                    screen.getByRole("link", { name: "Link to work" })
                ).toBeInTheDocument();
            });

            // Close button in ModalWork footer (last one, first is X-button ButtonModalClose)
            fireEvent.click(
                screen.getAllByRole("button", { name: "Close" }).at(-1)!
            );

            await waitFor(() => {
                expect(
                    screen.queryByRole("link", { name: "Link to work" })
                ).not.toBeInTheDocument();
            });
        });

        test("clicking another card opens its data", async () => {
            renderWorks();

            // Open first
            fireEvent.click(screen.getByText("Portfolio App"));
            await waitFor(() => {
                expect(
                    screen.getByRole("link", { name: "Link to work" })
                ).toHaveAttribute("href", "https://github.com/portfolio");
            });

            // Close (last Close button — MUI outlined, first is X-button)
            fireEvent.click(
                screen.getAllByRole("button", { name: "Close" }).at(-1)!
            );

            // Open second
            fireEvent.click(screen.getByText("REST API Server"));
            await waitFor(() => {
                expect(
                    screen.getByRole("link", { name: "Link to work" })
                ).toHaveAttribute("href", "https://github.com/api-server");
            });
        });
    });

    // ── 3. Filter ─────────────────────────────────────────────────────────────

    describe("Filter — integration with Works", () => {
        test("Filter appears after works load with categories", async () => {
            mockUseGetWorksQuery.mockReturnValue({
                status: "success",
                data: mockWorks,
            });
            renderWorks();

            await waitFor(() => {
                expect(
                    screen.getByRole("button", { name: "All" })
                ).toBeInTheDocument();
            });
            expect(
                screen.getByRole("button", { name: "Frontend" })
            ).toBeInTheDocument();
            expect(
                screen.getByRole("button", { name: "Backend" })
            ).toBeInTheDocument();
        });

        test("does not show Filter while data is loading", () => {
            mockUseGetWorksQuery.mockReturnValue({
                status: "loading",
                data: undefined,
            });
            renderWorks();
            expect(
                screen.queryByRole("button", { name: "All" })
            ).not.toBeInTheDocument();
        });

        test("calls API with category id on filter click", async () => {
            mockUseGetWorksQuery.mockReturnValue({
                status: "success",
                data: mockWorks,
            });
            renderWorks();

            await waitFor(() => {
                expect(
                    screen.getByRole("button", { name: "Frontend" })
                ).toBeInTheDocument();
            });

            fireEvent.click(screen.getByRole("button", { name: "Frontend" }));

            // Check that useGetWorksQuery called with category id "cat1"
            expect(mockUseGetWorksQuery).toHaveBeenCalledWith(
                "cat1",
                expect.any(Object)
            );
        });

        test('resets filter on "All" click', async () => {
            mockUseGetWorksQuery.mockReturnValue({
                status: "success",
                data: mockWorks,
            });
            renderWorks();

            await waitFor(() => {
                expect(
                    screen.getByRole("button", { name: "Frontend" })
                ).toBeInTheDocument();
            });

            fireEvent.click(screen.getByRole("button", { name: "Frontend" }));
            fireEvent.click(screen.getByRole("button", { name: "All" }));

            // After reset — useGetWorksQuery called with undefined
            expect(mockUseGetWorksQuery).toHaveBeenLastCalledWith(
                undefined,
                expect.any(Object)
            );
        });
    });

    // ── 4. ModalHireMe ────────────────────────────────────────────────────────

    describe("Hire Me button → ModalHireMe", () => {
        beforeEach(() => {
            mockUseGetWorksQuery.mockReturnValue({
                status: "success",
                data: mockWorks,
            });
        });

        test("opens ModalHireMe", async () => {
            renderWorks();
            fireEvent.click(screen.getByRole("button", { name: "Hire Me" }));

            await waitFor(() => {
                expect(screen.getByText("Let's talk!")).toBeInTheDocument();
            });
            expect(screen.getByLabelText("Name")).toBeInTheDocument();
            expect(screen.getByLabelText("Email")).toBeInTheDocument();
        });

        test("closes ModalHireMe via X button", async () => {
            renderWorks();
            fireEvent.click(screen.getByRole("button", { name: "Hire Me" }));

            await waitFor(() => {
                expect(screen.getByText("Let's talk!")).toBeInTheDocument();
            });

            // X-button (ButtonModalClose)
            fireEvent.click(
                screen.getAllByRole("button", { name: "Close" })[0]
            );

            await waitFor(() => {
                expect(
                    screen.queryByText("Let's talk!")
                ).not.toBeInTheDocument();
            });
        });
    });

    // ── 5. Without authorization ──────────────────────────────────────────────

    describe("without authorization", () => {
        beforeEach(() => {
            mockUseGetWorksQuery.mockReturnValue({
                status: "loading",
                data: undefined,
            });
        });

        test("shows AccessDenied overlay", () => {
            renderWorks(null);
            expect(
                screen.getByText(/Exclusive Projects Await/)
            ).toBeInTheDocument();
        });

        test("shows skeleton placeholders with blur", () => {
            renderWorks(null);
            const skeletons = document.querySelectorAll(".MuiSkeleton-root");
            expect(skeletons.length).toBeGreaterThan(0);
        });

        test("does not show works list", () => {
            renderWorks(null);
            expect(screen.queryByText("Portfolio App")).not.toBeInTheDocument();
        });
    });
});
