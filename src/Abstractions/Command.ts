import ICommand from '../Interfaces/ICommand'
import { Message, Collection } from 'discord.js';
import { CommandModel } from '../Database/Models/CommandModel';

abstract class Command implements ICommand {
    public AllowedChannels  : string[];
    public AllowedRoles     : string[];
    public Data             : {};
    public RequiresDatabase : boolean;
    public Signature        : string;

    public constructor(channels: string[], roles: string[], dbRequired = false) {
        this.AllowedChannels = channels;
        this.AllowedRoles = roles;
        this.RequiresDatabase = dbRequired;
    }

    public AddAllowedChannel(channelId: string): void {
        this.AllowedChannels.push(channelId);
    }

    public RemoveAllowedChannel(channelId: string):void {
        this.AllowedChannels = this.AllowedChannels.filter(id => id !== channelId);
    }

    public AddAllowedRole(roleId: string): void {
        this.AllowedRoles.push(roleId);
    }

    public RemoveAllowedRole(roleId: string): void {
        this.AllowedRoles = this.AllowedRoles.filter(id => id !== roleId);
    }

    protected validateChannel(channelId: string): boolean {
        return this.AllowedChannels.length === 0 || this.AllowedChannels.includes(channelId);
    }

    protected ValidatePermission(roles: Collection<any, any>): boolean {
        return this.AllowedRoles.length === 0 || roles.find((role) => this.AllowedRoles.includes(role));
    }

    public Call(message: Message): Promise<any> {
        if (!this.ValidatePermission(message.member.roles) && !this.validateChannel(message.channel.id)) {
            console.log('[Failed Permission]', message.member.displayName, message.channel.id, message.content);

            return Promise.reject('');
        }

        return this.Run(message);
    }

    public async Save(): Promise<any> {
        const {AllowedChannels, AllowedRoles, Data, RequiresDatabase} = this;
        const Namespace = this.Namespace();
        const model = await CommandModel.findOne({Namespace})

        // if we have no data
        if (RequiresDatabase || !model) {
            const model = new CommandModel({
                AllowedChannels,
                AllowedRoles,
                Data,
                Namespace
            })
    
            return await model.save()
        }

        model.AllowedChannels = AllowedChannels;
        model.AllowedRoles = AllowedRoles;
        model.Data = Data;
        
        return await model.save();
    }

    public abstract Run(message: Message): Promise<any>;
    public abstract Namespace(): string;
}

export default Command;