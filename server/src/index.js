import './config/env.js'
import app from "./app.js";
import initDatabase from "./db/init.js";

const startServer = async () => {
    try {
        await initDatabase()

    const PORT = process.env.PORT || 4000
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`)
    })
    } catch (error) {
        console.error(`Error in connecting to Database: ${error.message}`)
        process.exitCode = 1
    }
}

startServer()