import Context from "./Context";
import { Message } from "discord.js";
import ICommandList from "../Interfaces/ICommandList";
import Commands from '../Commands';
import CommandList from "../Models/CommandList";
import IProcessor from "../Interfaces/IProcessor";

const EMPTY_COMMAND = {
    AllowedChannels: [],
    AllowedRoles   : [],
    Data           : {}
}

export default class Processor implements IProcessor {
    static DELAY_TIMER = 300;

    Commands: CommandList;
    Context : Context;
    Loaded  : boolean;
    Prefix  : string;

    constructor(context: Context, prefix = '!') {
        this.Context  = context;
        this.Prefix   = prefix;
        this.Loaded   = false;

        this.LoadCommands()
            .then(() => {
                this.Loaded = true;
            });
    }

    private async LoadCommands(): Promise<ICommandList> {
        const data             = new CommandList();
        const databaseCommands = this.Context.State.Commands;

        Object.keys(Commands).forEach((key: string) => {
            const commandData = databaseCommands[key] || {...EMPTY_COMMAND, Namespace: key};

            const {AllowedChannels, AllowedRoles} = commandData;

            data[key] = new Commands[key](AllowedChannels, AllowedRoles, !!databaseCommands[key])
        })

        this.Commands = data

        return data
    }

    public async Handle(message: Message): Promise<any> {
        if (this.Context.Loading === true || this.Loaded === false) {
            console.log('[WARNING] Message Received before Data is loaded, delaying')
            setTimeout(() => this.Handle(message), Processor.DELAY_TIMER)

            return;
        }
        if (message.content.indexOf(this.Prefix) !== 0) {
            return Promise.resolve('');
        }

        const name = message.content.split(' ').pop().substr(1);

        try {
            return await this.Commands[name].Run(message);
        } catch(e) {
            return Promise.reject(e);
        }
    }
}