import ICommand from '../Interfaces/ICommand'
import { Message, Collection } from 'discord.js';

abstract class Command implements ICommand {
    public AllowedChannels  : string[];
    public AllowedRoles     : string[];
    public Data             : {};
    public RequiresDatabase : boolean;
    public Signature        : string;

    public constructor(channels: string[], roles: string[], dbRequired = false) {
        this.AllowedChannels  = channels;
        this.AllowedRoles     = roles;
        this.RequiresDatabase = dbRequired;
    }

    public get LocalData() {
        return this.Data[this.Name()];
    }

    public set LocalData(value: any) {
        this.Data[this.Name()] = value;
    }

    public get HasLocalData(): boolean {
        return !!this.Data[this.Name()];
    }

    private HasLocalField(name: string): boolean {
        return this.HasLocalData && !!this.LocalData[name];
    }

    public AddAllowedChannel(channelId: string, local = false): void {
        if (!local) {
            this.AllowedChannels.push(channelId);
        } else if (this.HasLocalField('AllowedChannels')) {
            this.LocalData.AllowedChannels.push(channelId);
        } else {
            this.LocalData.AllowedChannels = [channelId];
        }
    }

    public RemoveAllowedChannel(channelId: string, local = false): void {
        if (!local) {
            this.AllowedChannels = this.AllowedChannels.filter(id => id !== channelId);
        } else if (this.HasLocalField('AllowedChannels')) {
            this.LocalData.AllowedChannels = this.LocalData.AllowedChannels.filter(id => id !== channelId);
        }
    }

    public AddAllowedRole(roleId: string, local = false): void {
        if (!local) {
            this.AllowedRoles.push(roleId);
        } else if (this.HasLocalField('AllowedRoles')) {
                this.LocalData.AllowedRoles.push(roleId);
        } else {
            this.LocalData.AllowedRoles = [roleId];
        }
    }

    public RemoveAllowedRole(roleId: string, local = false): void {
        if (!local) {
            this.AllowedRoles = this.AllowedRoles.filter(id => id !== roleId);
        } else if (this.HasLocalField('AllowedRoles')) {
            this.LocalData.AllowedRoles = this.LocalData.AllowedRoles.filter(id => id !== roleId);
        }
    }

    protected validateChannel(channelId: string): boolean {
        let AllowedChannels;

        if (this.HasLocalData) {
            AllowedChannels = [...this.AllowedChannels, ...(this.Data[this.Name()].AllowedChannels || [])];
        } else {
            AllowedChannels = this.AllowedChannels;
        }

        return AllowedChannels.length === 0 || AllowedChannels.includes(channelId);
    }

    protected ValidatePermission(roles: Collection<any, any>): boolean {
        let AllowedRoles;

        if (this.HasLocalData) {
            AllowedRoles = [...this.AllowedRoles, ...(this.Data[this.Name()].AllowedRoles || [])];
        } else {
            AllowedRoles = this.AllowedRoles;
        }

        return AllowedRoles.length === 0 || roles.find((role) => AllowedRoles.includes(role));
    }

    public Call(message: Message): Promise<any> {
        if (!this.ValidatePermission(message.member.roles) && !this.validateChannel(message.channel.id)) {
            console.warn('[Failed Permission]', message.member.displayName, message.channel.id, message.content);

            return Promise.reject('');
        }

        return this.Run(message);
    }

    public abstract Run(message: Message): Promise<any>;
    public abstract Name(): string;
    public abstract Namespace(): string;
}

export default Command;