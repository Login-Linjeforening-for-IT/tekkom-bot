import { SlashCommandBuilder } from 'discord.js'

export const data = new SlashCommandBuilder()
    .setName('tagticket')
    .setDescription('Tags a ticket.')

export async function execute() {
    // Handled by handleComponents() in app.ts
    return
}
