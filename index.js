const fs = require("node:fs");
const path = require("node:path");
const Discord = require("discord.js");
const { Player, QueryType } = require("discord-player");
require("dotenv").config();

const client = new Discord.Client({
    intents: [
        Discord.IntentsBitField.Flags.Guilds,
        Discord.IntentsBitField.Flags.GuildMessages,
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.MessageContent,
        Discord.GatewayIntentBits.Guilds,
        Discord.IntentsBitField.Flags.GuildVoiceStates,
    ],
});

// add the specific commands
client.commands = new Discord.Collection();
const commandPath = path.join(__dirname, "commands");
const commandFiles = fs
    .readdirSync(commandPath)
    .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
    console.log(file)
    const filePath = path.join(commandPath, file);
    const command = require(filePath);
    console.log(command);
    client.commands.set(command.data.name, command);
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

const player = new Player(client);

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args, player));
    }
}

player.on("error", (queue, error) => {
    console.log(`[${queue.guild.name}] Error emitted from the queue: ${error.message}`);
});
player.on("connectionError", (queue, error) => {
    console.log(`[${queue.guild.name}] Error emitted from the connection: ${error.message}`);
});

player.on("trackStart", (queue, track) => {
    console.log('inside the trackStart ', queue);
    queue.metadata.send(`🎶 | Started playing: **${track.title}** in **${queue.connection.channel.name}**!`);
});

player.on("trackAdd", (queue, track) => {
    console.log('inside the trackAdd', queue);
    queue.metadata.send(`🎶 | Track **${track.title}** queued!`);
});

player.on("botDisconnect", (queue) => {
    console.log('inside the botDisconnect', queue);
    queue.metadata.send("❌ | I was manually disconnected from the voice channel, clearing queue!");
});

player.on("channelEmpty", (queue) => {
    console.log('inside the channelEmpty', queue);
    queue.metadata.send("❌ | Nobody is in the voice channel, leaving...");
});

player.on("queueEnd", (queue) => {
    console.log('inside the queueEnd', queue);
    queue.metadata.send("✅ | Queue finished!");
});

client.login(process.env.TOKEN);