import { Client, ColorResolvable, EmbedBuilder, TextChannel } from "discord.js"

export default async function sendMessages(client: Client, messages: Announcement[]) {
    const sent = []
    for (const message of messages) {
        const channel = client.channels.cache.get(message.channel)
         if (!channel || !channel.isTextBased()) {
            console.warn(`Channel ${message.channel} not found or not a text channel.`)
            continue
        }

        const textChannel = channel as TextChannel

        if (message.embed) {
            // Send as an embed
            const embed = new EmbedBuilder()
                .setTitle(message.title)
                .setDescription(message.description)
                .setColor((message.color as ColorResolvable) ?? "#fd8738")

            await textChannel.send({ embeds: [embed] })
        } else {
            await textChannel.send(`**${message.title}**\n${message.description}`)
        }

        sent.push(message)
    }

    return sent
}
