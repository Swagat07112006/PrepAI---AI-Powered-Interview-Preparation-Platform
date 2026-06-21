import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import router from './routes/auth.routes.js'
import errorHandler from './middlewares/error.middleware.js'

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}))
app.use(express.json({
    limit: "16kb",
}))
app.use(express.urlencoded({
    extended: true,
    limit: "16kb",
}))
app.use(cookieParser())
app.use('/api/v1/auth', router)
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "PrepAI API Running"
    });
});
app.use(errorHandler)
export default app