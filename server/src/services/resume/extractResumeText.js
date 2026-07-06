import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";
import ApiError from "../../utils/ApiError.js";

const extractResumeText = async (file) => {
    if (!file) {
        throw new ApiError(400, "Resume file is required");
    }

    if (file.mimetype === "application/pdf") {
        const parser = new PDFParse({
            data: file.buffer,
        });

        const result = await parser.getText();
        await parser.destroy();

        return result.text;
    }

    if (
        file.mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
        const result = await mammoth.extractRawText({
            buffer: file.buffer,
        });

        return result.value;
    }

    throw new ApiError(400, "Unsupported file type");
};

export default extractResumeText;