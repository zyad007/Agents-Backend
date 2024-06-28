import express, { json } from "express";
import cors from 'cors';
import chatRouter from "./api/ChatRouter";
import botRouter from "./api/BotRouter";
import './openai/opanai'
import openai from "./openai/opanai";

console.log('ENV:' + process.env.NODE_ENV);

const app = express();
const port = process.env.PORT || 3000;

// JSON Parser Middleware
app.use(json());
app.use(cors());

// Routers Middleware
app.use('/chat', chatRouter);
app.use('/bot', botRouter);

openai.beta.assistants.list().then(x => {
    console.log(x.data);
})
app.listen(port, () => {
    console.log('Server listening on port: ' + port);
})