import { render, screen, fireEvent } from "@testing-library/react";
import { Certificate } from "./Certificate";
import { ICertificate } from "../../../assets/interfaces/NewInterfaces";

// Мокаем анимацию — она мешает тестам
jest.mock("react-awesome-reveal", () => ({
    Fade: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Мокаем lazy-load изображение
jest.mock("../../../assets/components/ImageLazyLoad/ImageLazyLoad", () => ({
    __esModule: true,
    default: ({ url }: { url: string }) => <img src={url} alt="certificate" />,
}));

const mockCertificate: ICertificate = {
    _id: "cert1",
    name: "React Advanced Course",
    dateFinished: new Date("2023-06-15"),
    category: { _id: "cat1", label: "Frontend" },
    cardImage: {
        url: "https://example.com/image.jpg",
        blurHash: "LKN]Rv%2Tw=w",
        destination: "/uploads",
        size: 12345,
    },
};

const renderCertificate = (overrides = {}) =>
    render(
        <Certificate
            certificate={mockCertificate}
            editSection={false}
            onClickEditCertificate={jest.fn()}
            {...overrides}
        />
    );

describe("Certificate", () => {
    test("renders certificate name", () => {
        renderCertificate();
        expect(screen.getByText("React Advanced Course")).toBeInTheDocument();
    });

    test("renders category label", () => {
        renderCertificate();
        expect(screen.getByText("Frontend")).toBeInTheDocument();
    });

    test("renders year from dateFinished", () => {
        renderCertificate();
        expect(screen.getByText("2023")).toBeInTheDocument();
    });

    test("does not render year when dateFinished is absent", () => {
        const cert = { ...mockCertificate, dateFinished: undefined };
        renderCertificate({ certificate: cert });
        expect(screen.queryByRole("time")).not.toBeInTheDocument();
    });

    test("renders image when cardImage is provided", () => {
        renderCertificate();
        const img = screen.getByRole("img", { name: "certificate" });
        expect(img).toHaveAttribute("src", "https://example.com/image.jpg");
    });

    test("does not render image when cardImage is absent", () => {
        const cert = { ...mockCertificate, cardImage: undefined };
        renderCertificate({ certificate: cert });
        expect(screen.queryByRole("img", { name: "certificate" })).not.toBeInTheDocument();
    });

    test("shows edit button when editSection=true", () => {
        renderCertificate({ editSection: true });
        expect(screen.getByRole("button")).toBeInTheDocument();
    });

    test("hides edit button when editSection=false", () => {
        renderCertificate({ editSection: false });
        expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });

    test("calls onClickEditCertificate when edit button clicked", () => {
        const onClickEditCertificate = jest.fn();
        renderCertificate({ editSection: true, onClickEditCertificate });
        fireEvent.click(screen.getByRole("button"));
        expect(onClickEditCertificate).toHaveBeenCalledTimes(1);
    });
});
