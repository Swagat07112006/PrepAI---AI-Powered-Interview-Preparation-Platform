import mongoose from 'mongoose'
const initDatabase = () => {
    const DATABASE_URL = process.env.MONGODB_URI

    if (!DATABASE_URL) {
        throw new Error('MONGODB_URI is not configured in the environment')
    }

    mongoose.connection.on('open', () => {
        console.info('PrepAI safely connected to database cluster')
    })
    const connection = mongoose.connect(DATABASE_URL);
    return connection;
}
export default initDatabase