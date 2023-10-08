import { readdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';
import { Client, Collection, Events, GatewayIntentBits } from 'discord.js';
import config from '../config.json' assert { type: "json" };
import info from '../../info.json' assert { type: "json" }

const token = config.token;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();
const foldersPath = join(__dirname, 'commands');
const commandFolders = readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = join(foldersPath, folder);
	const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = join(commandsPath, file);
        const command = await import(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

client.once(Events.ClientReady, async() => {
    // client.application.commands.set([]) // Use to perge all inactive slash commands from Discord
	console.log('Ready!');

    if (info.interaction) {
        const embed = new EmbedBuilder()
        .setTitle('Restart')
        .setDescription('Restarted the bot.')
        .setColor("#fd8738")
        .setTimestamp()
        .setAuthor({name: `Author: ${interaction.user.username} · ${interaction.user.id}`})
        .addFields(
            {name: "Status", value: "Success", inline: true},
            {name: "Reason", value: info.reason, inline: true},
            {name: "Branch", value: info.branch, inline: true},
        )
        await info.interaction.editReply({ embeds: [embed]});

        const commands = [
            `echo '{"branch": "", "reason": "", "interaction": ""}' > ../info.json`,
            'rm ../temp.sh'
        ];
    
        exec(commands.join(' && '))
    }

});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

client.login(token);

// https://linjeforeningen.it does not work, timeout error