import { SlashCommandBuilder } from 'discord.js'

export const data = new SlashCommandBuilder()
    .setName('create')
    .setDescription('Creates a ticket.')

export async function execute() {
    // Handled by handleComponents() in app.ts
    return
}
