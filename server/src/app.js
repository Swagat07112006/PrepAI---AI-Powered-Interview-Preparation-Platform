import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import AuthRouter from './routes/auth.routes.js'
import errorHandler from './middlewares/error.middleware.js'
import questionRouter from './routes/question.routes.js'
import notesRouter from './routes/note.routes.js'
import revisionRouter from './routes/revision.route.js'

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

app.use('/api/v1/auth', AuthRouter)
app.use('/api/v1/questions', questionRouter)
app.use('/api/v1/notes', notesRouter)
app.use('/api/v1/revisions', revisionRouter)

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "PrepAI API Running"
    });
});

app.use(errorHandler)
export default app