import { RequestHandler } from "express";
import openai, { bots, chats, setChats } from "../openai/opanai";
import { Chat } from "../types/Chat";

export const test: RequestHandler = async (req, res, next) => {

    try {

        const { username, password } = req.body;

        // API Logic

        return res.status(200).send();

    }

    catch (e) {
        next(e)
    }

}

export const send: RequestHandler<{ id: string, botId: string }> = async (req, res, next) => {
    try {
        const { messages } = req.body;
        const { id, botId } = req.params;

        const chat = chats.find(x => x.id);

        if (!chat) {
            return res.status(404).send('There no chat with this Id');
        }

        if (!chat.bots?.length) {
            return res.status(404).send('There is no bots in this chat');
        }

        const firstBot = chat.bots[0];

        const bot = await openai.beta.assistants.retrieve(botId);

        if (!bot) {
            return res.status(404).send('There is no bot with this id');
        }

        await openai.beta.threads.messages.create(
            id,
            {
                role: 'user',
                content: messages
            }
        )

        // Run 
        let run = await openai.beta.threads.runs.createAndPoll(
            id,
            {
                assistant_id: bot.id
            }
        )

        if (run.status === 'completed') {
            const messages = await openai.beta.threads.messages.list(
                run.thread_id
            );

            console.log((messages.data[0].content[0] as any).text.value);

            return res.send((messages.data[0].content[0] as any).text.value);
        } else {
            console.log(run.status);

            return res.status(500).send();
        }
    }
    catch (e) {
        next(e);
    }
}

export const create: RequestHandler = async (req, res, next) => {
    try {

        const { name } = req.body;

        // Create Thread
        const thread = await openai.beta.threads.create();


        chats.push({
            name,
            id: thread.id,
            bots: []
        })

        return res.send(chats);

    }
    catch (e) {
        next(e)
    }
}


export const get: RequestHandler<{ id: string }> = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Create Thread
        const thread = await openai.beta.threads.retrieve(id);

        const messages = await openai.beta.threads.messages.list(thread.id);

        return res.send(messages);

    }
    catch (e) {
        next(e)
    }
}

export const del: RequestHandler<{ id: string }> = async (req, res, next) => {
    try {

        const { id } = req.params;

        const thread = await openai.beta.threads.retrieve(id);

        if (!thread) return res.status(404).send();

        // Create Thread
        await openai.beta.threads.del(id);

        setChats(chats.filter(x => x.id !== id));
        return res.send(chats);
    }
    catch (e) {
        next(e)
    }
}

export const getAll: RequestHandler = async (req, res, next) => {
    try {
        res.send(chats);
    }
    catch (e) {
        next(e)
    }
}

export const getBots: RequestHandler<{ id: string }> = async (req, res, next) => {
    try {
        const { id } = req.params;

        const bots = chats.find(x => x.id === id)?.bots;

        return res.send(bots?.length ? bots : []);
    }
    catch (e) {
        next(e)
    }
}

export const addBot: RequestHandler<{ id: string }> = async (req, res, next) => {
    try {
        const { id } = req.params;
        let { botId } = req.body;


        if (!botId.startsWith('asst_')) {
            botId = bots.find(x => x.name === botId)?.id;
        }

        const bot = await openai.beta.assistants.retrieve(botId);

        if (!bot) return res.send(404);

        const chat = await openai.beta.threads.retrieve(id);

        if (!chat) return res.send(404);

        if (chats.find(x => x.id === id)!.bots.filter(y => y.id === botId).length) {
            return res.status(400).send('Bot already added')
        }

        setChats(chats.map(x => {
            if (x.id === id) {
                x.bots = x.bots.concat({
                    id: bot.id,
                    name: bot.name!
                })
            }
            return x;
        }))

        return res.send();

    }
    catch (e) {
        res.status(404).send()
    }
}

export const removeBot: RequestHandler<{ id: string, botId: string }> = async (req, res, next) => {
    try {
        const { id, botId } = req.params;

        const bot = await openai.beta.assistants.retrieve(botId);

        if (!bot) return res.send(404);

        const chat = await openai.beta.threads.retrieve(id);

        if (!chat) return res.send(404);

        setChats(chats.map(x => {
            if (x.id === id) {
                x.bots = x.bots.filter(x => x.id !== botId);
            }
            return x;
        }))

        return res.send();

    }
    catch (e) {
        res.status(404).send()
    }
}