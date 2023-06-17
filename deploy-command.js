const { SlashCommandBuilder, Routes } = require('discord.js');
const { REST } = require('@discordjs/rest');
require("dotenv").config();

const playOptions = [{
    name: "query",
    type: "STRING",
    description: "The song you want to play",
    required: true
}]
const commands = [
        new SlashCommandBuilder().setName('ping').setDescription('Replies with pong!'),
        new SlashCommandBuilder().setName('server').setDescription('Replies with server info!'),
        new SlashCommandBuilder().setName('user').setDescription('Replies with user info!'),
        new SlashCommandBuilder().setName('play').setDescription(`Queue's up the song!`)
        .addStringOption(option => option.setName('query').setDescription('The song you want to play').setRequired(true)),
        new SlashCommandBuilder().setName('skip').setDescription(`Skips the song!`),
        new SlashCommandBuilder().setName('stop').setDescription(`Stop the currently playing song!`),
    ]
    .map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

rest.put(Routes.applicationGuildCommands(process.env.CLIENTID, process.env.GUILDID), { body: commands })
    .then(() => console.log('Successfully registered application commands.'))
    .catch(console.error);