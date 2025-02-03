import mongoose from "mongoose";

const connectDB = async()=>{
    try {
        await mongoose.connect(`${process.env.MONGO_URI}`)
        console.log('Mongodb is Connected')
    } catch (error) {
        console.log(`Something Error Happened while connecting ${error}`)
        process.exit(1)
    }
}

export default connectDB



