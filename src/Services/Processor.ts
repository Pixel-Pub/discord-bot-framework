import Context from "./Context";
import { Message } from "discord.js";
import ICommandList from "../Interfaces/ICommandList";
import Commands from '../Commands';
import Command from "../Abstractions/Command";
import CommandModel from '../Database/Models/CommandModel'
import CommandList from "../Models/CommandList";

interface ProcessorInterface {
    Commands: ICommandList;
    Context : Context;
    Database: any;
    Loaded  : boolean;
    Prefix  : string;
}

export default class Processor implements ProcessorInterface {
    Commands: CommandList;
    Context : Context;
    Database: any;
    Loaded  : boolean;
    Prefix  : string;

    constructor(context: Context, database: any, prefix = '!') {
        this.Context  = context;
        this.Database = database;
        this.Prefix   = prefix;
        this.Loaded   = false;

        this.LoadCommands()
            .then(() => {
                this.Loaded = true
            })
    }

    private async LoadCommands(): Promise<ICommandList> {
        const commandsData = await CommandModel.find()
        const data = new CommandList

        Object.keys(Commands).forEach((key: string) => {
            const commandData = commandsData.find(({Namespace}) => Namespace === key)

            if (commandData) {
                const {AllowedChannels, AllowedRoles, Data} = commandData
                const command: Command = new Commands[key](AllowedChannels, AllowedRoles, true)

                command.Data = Data

                data[key] = command
            } else {
                data[key] = new Commands[key]([], [], false)
            }
        })

        this.Commands = data

        return data
    }

    public async Handle(message: Message): Promise<any> {
        if (message.content.indexOf(this.Prefix) !== 0) {
            return Promise.resolve('');
        }

        const name = message.content.split(' ').pop().substr(1)

        try {
            return await this.Commands[name].Run(message)
        } catch(e) {
            return Promise.reject(e)
        }
    }
}