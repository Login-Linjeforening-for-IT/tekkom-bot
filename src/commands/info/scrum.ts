import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'

export const data = new SlashCommandBuilder()
    .setName('scrum')
    .setDescription('Reply to someone with scrum information')
    .addUserOption(option => 
        option.setName('user')
            .setDescription('The user to reply to')
            .setRequired(true)
    )

export async function execute(message: ChatInputCommandInteraction) {
    const user = message.options.getUser('user')
    
    if (!user) {
        await message.reply({ content: 'Please specify a user to reply to!', ephemeral: true })
        return
    }
    
    const scrumMessage = `scrum <3`
    
    await message.reply(scrumMessage)
}
