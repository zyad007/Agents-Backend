export type Chat = {
    id: string,
    name: string,
    bots: Bot[]
}

type Bot = {
    id: string,
    name: string
}