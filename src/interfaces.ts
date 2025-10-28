import { Role } from 'discord.js'
import { Client, Collection } from 'discord.js'

export type Roles = {
    cache: Role[]
}

export const Increment = {
    MAJOR: 0,
    MINOR: 1,
    PATCH: 2
} as const

export type Increment = typeof Increment[keyof typeof Increment]

export const Build = {
    DEPLOYMENT: 'deployment',
    RELEASE: 'release'
}

export type Build = typeof Build[keyof typeof Build]

interface Command {
    data: { name: string }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    execute: (...args: any[]) => Promise<void>
}

export class DiscordClient extends Client<true> {
    public commands: Collection<string, Command> = new Collection()
}
