import { Role } from "discord.js"
import { Client, Collection } from 'discord.js'

declare module 'discord.js' {
    interface Reaction {
        _emoji: {
            name: string
        }
    }
    interface Client {
        commands: Collection<string, Command>
    }
}

export interface Roles {
    cache: Role[]
}

export enum Increment {
    MAJOR,
    MINOR,
    PATCH
}

export enum Build {
    DEPLOYMENT = 'deployment',
    RELEASE = 'release'
}

interface Command {
    data: { name: string }
    execute: (...args: any[]) => Promise<void>
}

export class DiscordClient extends Client<true> {
    public commands: Collection<string, Command> = new Collection()
}
