import Context from "./Context";
import { Message } from "discord.js";
import ICommandList from "../Interfaces/ICommandList";
import Commands from '../Commands';
import CommandList from "../Models/CommandList";
import IProcessor from "../Interfaces/IProcessor";

const EMPTY_COMMAND = {
    AllowedChannels: [],
    AllowedRoles   : [],
    AllowedUsers   : [],
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
        if (this.Context.Loading === true) {
            const deferred = new Promise((resolve) => setTimeout(resolve, 300));

            await deferred;
        }

        const data             = new CommandList();
        const databaseCommands = this.Context.State.Commands;

        Object.keys(Commands).forEach((key: string) => {
            const commandData = databaseCommands[key] || {...EMPTY_COMMAND, Namespace: key};

            const {AllowedChannels, AllowedRoles, AllowedUsers, Data} = commandData;  

            data[key.toLowerCase()]      = new Commands[key](AllowedChannels, AllowedRoles, AllowedUsers, !!databaseCommands[key]);
            data[key.toLowerCase()].Data = Data;

            console.log('[SUCCESS] Loaded Command', key);
        })

        this.Commands = data;

        return data;
    }

    public async Handle(message: Message): Promise<any> {
        if (this.Context.Loading === true || this.Loaded === false) {
            console.log('[WARNING] Message Received before Data is loaded, delaying');
            setTimeout(() => this.Handle(message), Processor.DELAY_TIMER);

            return;
        }

        if (message.content.indexOf(this.Prefix) !== 0) {
            return Promise.resolve('');
        }

        const name = message.content.split(' ').shift().substr(1);

        console.log('[MESSAGE] Running', name, message.content);
        try {
            return await this.Commands[name.toLowerCase()].Call(message);
        } catch(e) {
            return Promise.reject(e);
        }
    }
}