import ICommand from '../Interfaces/ICommand';
import { Message, Collection } from 'discord.js'

abstract class Command implements ICommand {
    public AllowedChannels  : string[];
    public AllowedRoles     : string[];
    public Data             : any;
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

    abstract Run(message: Message): Promise<any>;
    abstract Name(): string;
    abstract Namespace(): string;

    private HasLocalField(name: string): boolean {
        return this.HasLocalData && !!this.LocalData[name];
    }

    protected ValidateChannel(channelId: string): boolean {
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

    private ModifyPermissions(type: string, action: string, key: string, local = false) {
        const permissionKey = `Allowed${type}`;

        if (!local) {
            if (action === 'add') {
                this[permissionKey].push(key);
            } else {
                this[permissionKey] = this[permissionKey].filter(entry => key === entry);
            }
        } else if(this.HasLocalField(permissionKey)) {
            if (action === 'add') {
                this.LocalData[permissionKey].push(key);
            } else {
                this.LocalData[permissionKey] = this.LocalData[permissionKey].filter(entry => key === entry);
            }
        } else {
            this.LocalData[permissionKey] = [key];
        }
    }

    public AddAllowedChannel(channelId: string, local = false): void {
        return this.ModifyPermissions('Channel', 'add', channelId, local);
    }

    public AddAllowedRole(roleId: string, local = false): void {
        return this.ModifyPermissions('Role', 'add', roleId, local);

    }

    public Call(message: Message): Promise<any> {
        if (!this.ValidatePermission(message.member.roles) && !this.ValidateChannel(message.channel.id)) {
            console.warn('[Failed Permission]', message.member.displayName, message.channel.id, message.content);

            return Promise.reject('');
        }

        return this.Run(message);
    }

    public GetContext(message: Message): any {
        const parts = message.content.split(' ').slice(1);
        const result = {
            args: []
        };

        parts.forEach((part: string) => {
            if (part.indexOf('--') === 0) {
                const param = part.split('=');

                result[param[0]] = param[1] || true;
            } else {
                result.args.push(part);
            }
        });

        return result;
    }

    public RemoveAllowedChannel(channelId: string, local = false): void {
        return this.ModifyPermissions('Channel', 'remove', channelId, local);

    }

    public RemoveAllowedRole(roleId: string, local = false): void {
        return this.ModifyPermissions('Role', 'remove', roleId, local);

    }
}

export default Command;