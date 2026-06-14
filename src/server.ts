import express, { type Application, type Request, type Response } from "express";
import Router from "./router/server.route.js";
import dotenv from "dotenv";
dotenv.config();

const app : Application = express();
const port : number = Number(process.env.PORT);

app.use(express.json());

app.use('/api', Router);

app.get('/', (req : Request, res : Response) => {
    res.status(200).json({
        success: true,
        message : "DevPulse is Running successfully",
    })
});

app.listen(port, () => {
    console.log(`Server is Running on ${port}`);
});