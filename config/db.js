import mongoose from 'mongoose'

const URI = process.env.MONGO_URI

const connectDb = () => {
    mongoose
    .connect(URI)
    .then(() => {console.log('Connected to Mongodb')})
    .catch((error) => {console.log(error)})
   
}

export default connectDb