import OpenAI from "openai";
import { Chat } from "../types/Chat";
import { Bot } from "../types/Bot";

export let bots: Bot[] = [];
export let chats: Chat[] = [];

export const setChats = (arr: Chat[]) => {
    chats = arr;
}

const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_TOKEN
})

console.log('Init OpenAI');

export default openai;
