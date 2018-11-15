import Discord, { Message } from 'discord.js';
import dotenv from 'dotenv';
import Context from './Services/Context';
import Processor from './Services/Processor';


// load environment
dotenv.config()

const client    = new Discord.Client();
const context   = new Context(client);
const processor = new Processor(context, '%')

client.on('message', (message: Message) => {
    processor
        .Handle(message)
        .catch((e) => {
            console.error('[FATAL EXCEPTION]', e)
        })
})
client.login(process.env.BOT_TOKEN);