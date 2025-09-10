import { SlashCommandBuilder, ChatInputCommandInteraction, MessageFlags, Embed, EmbedBuilder } from 'discord.js'
import getBtg from '../../utils/btg/getBtg.js'
import postBtg from '../../utils/btg/postBtg.js'

export const data = new SlashCommandBuilder()
    .setName('btg')
    .setDescription('Whitelist btg account')
    .addStringOption((option) => option
        .setName('name')
        .setDescription('Name to whitelist')
    )
    .addStringOption((option) => option
        .setName('service')
        .setDescription('Service to whitelist for')
        .addChoices(
            { name: "BeeKeeper", value: "beekeeper" },
            { name: "QueenBee", value: "queenbee" }
        )
    )
export async function execute(message: ChatInputCommandInteraction) {
    const name = message.options.getString('name')
    const service = message.options.getString('service')
    const author = message.user.id

    if (!name || !service || !author) {
        return await message.reply({
            content: "Please specify which user to whitelist and what service to whitelist for.",
            flags: MessageFlags.Ephemeral
        })
    }

    await whitelist(message, name, service, author)
}

async function whitelist(message: ChatInputCommandInteraction, name: string, service: string, author: string) {
    const btg = await getBtg()

    for (const account of btg) {
        if (account.name === name && account.service === service) {
            return await message.reply({
                content: `Btg account '${name}' is already whitelisted for service ${service} by ${account.author}.`,
                flags: MessageFlags.Ephemeral
            })
        }
    }

    const success = await postBtg(name, service, author)
    if (!success) {
        return await message.reply({
            content: `Failed to whitelist btg account '${name}' for service ${service}. Please try again later.`,
            flags: MessageFlags.Ephemeral
        })
    }


    const embed = new EmbedBuilder()
        .setTitle('🐝 Break The Glass 🐝')
        .setDescription(`Successfully added ping exception for BTG account ${name} for ${service}`)
        .setColor("#fd8738")
        .setTimestamp()

    await message.reply({ embeds: [embed] })
}
