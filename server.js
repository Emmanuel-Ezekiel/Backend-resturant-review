import express from "express"
import cors from "cors"
import restaurant from "./api/restaurant.route.js"


const app = express()

app.use(cors())
app.use(express.json())


app.use("/api/v1/restaurant", restaurant)
app.use("*", (req,res) => res.status(404).json({error: "not found"}))


export default app