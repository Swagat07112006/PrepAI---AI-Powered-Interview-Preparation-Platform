import multer from 'multer';
import ApiError from '../utils/ApiError.js';
const storage = multer.memoryStorage()
const fileFilter = (req, file, cb) => {
    const allowed = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
    ];
    if(allowed.includes(file.mimetype)){
        cb(null, true)
    }
    else{
        cb(new ApiError(400, "Only PDF and DOCX files are allowed"), false)
    }
}
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
})

export default upload;