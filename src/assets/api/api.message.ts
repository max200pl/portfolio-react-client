import { DataMessage } from "../../modals/ModalHireMe/ModalHireMeForm/ModalHireMeForm";

export const sendMessage = async (data: DataMessage): Promise<Response> => {
    const result = await fetch("https://formspree.io/f/myzgwqzv", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    return result;
};
