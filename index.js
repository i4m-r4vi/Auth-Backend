import express from 'express'
import dotenv from 'dotenv'
import connectDB from './db/db.js'
import AuthRoutes from './routes/auth.routes.js'
import bodyParser from 'body-parser'

const app = express()
dotenv.config()

app.use(express.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use('/api/auth',AuthRoutes);


app.get('/',(req,res)=>{
    res.json("This is Home")
})

app.listen(process.env.PORT,()=>{
    connectDB()
    console.log(`The Port is Listening on ${process.env.PORT}`)
})

