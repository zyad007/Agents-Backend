import { RequestHandler } from "express";
import openai, { bots } from "../openai/opanai";
import OpenAI from "openai";
import { Bot } from "../types/Bot";

export const getAll: RequestHandler = (req, res, next) => {
    try {
        res.send(bots)
    }
    catch (e) {
        next(e)
    }
}

export const create: RequestHandler = async (req, res, next) => {
    try {

        const { name, instruction } = req.body;

        if (!name || !instruction) return res.status(400).send();

        const bot = await openai.beta.assistants.create({
            name: name as string,
            instructions: instruction as string,
            model: 'gpt-4o'
        })

        bots.push({
            id: bot.id,
            name: bot.name!,
            model: bot.model,
            instruction: bot.instructions!
        })

        return res.send({
            id: bot.id,
            name: bot.name
        })
    }
    catch (e) {
        next(e)
    }
}

export const del: RequestHandler<{ id: string }> = async (req, res, next) => {
    try {
        const { id } = req.params;

        const bot = await openai.beta.assistants.retrieve(id);

        if (!bot) return res.status(404).send();

        await openai.beta.assistants.del(id);

        return res.send()
    }
    catch (e) {
        next(e)
    }
}