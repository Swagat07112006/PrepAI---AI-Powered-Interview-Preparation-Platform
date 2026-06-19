import mongoose from 'mongoose'
const initDatabase = () => {
    const DATABASE_URL = 'mongodb://localhost:27017/prepai'
    mongoose.connection.on('open', () => {
        console.info('PrepAI safely connected to database cluster:', DATABASE_URL);
    })
    const connection = mongoose.connect(DATABASE_URL);
    return connection;
}
export default initDatabase