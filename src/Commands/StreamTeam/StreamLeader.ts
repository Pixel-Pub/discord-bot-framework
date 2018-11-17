import Command from "../../Abstractions/Command";
import { Message } from "discord.js";
import { ROLES } from "../../Services/Constants";

class StreamLeader extends Command {
    static NAME  = 'streamLeader';
    static ROLE  = ROLES.STREAM_TEAM_MANAGER;
    static ROLES = [
        ROLES.ADMIN,
        ROLES.STAFF
    ];

    public Name(): string { 
        return StreamLeader.NAME;
    }
    public Namespace(): string { 
        return 'StreamTeam';
    }

    public constructor(channels: string[], roles: string[], users: string[], dbRequired = false) {
        super(channels, StreamLeader.ROLES, users, dbRequired);

        console.log('StreamLeader Ignoring:', roles);
    }

    private async AddDiscordRole(message: Message, id): Promise<any> {
        const guild  = message.guild;
        const member = guild.members.find((member) => member.id === id);

        if (!member.roles.has(StreamLeader.ROLE)) {
            member.addRole(StreamLeader.ROLE, `Added by ${message.author.username}`);
        }
    }

    private async RemoveDiscordRole(message: Message, id: string): Promise<any> {
        const guild  = message.guild;
        const member = guild.members.find((member) => member.id === id);

        if (member.roles.has(StreamLeader.ROLE)) {
            return member.removeRole(StreamLeader.ROLE,  `Removed by ${message.author.username}`);
        }
    }
    public async Run(message: Message): Promise<any> {
        const context = this.GetContext(message);
        const parameter = context.args[1].replace(/\D/g, '');

        switch((context.args[0] || '').toLowerCase()) {
            case 'add':
                await Promise.all([
                    this.AddAllowedUser(parameter),
                    this.AddDiscordRole(message, parameter)
                ]);

                break;
            case 'delete':
                await Promise.all([
                    this.RemoveAllowedUsers(context.args[1]),
                    this.RemoveDiscordRole(message, parameter)
                ]);

                break;
            default:
                return message.channel.send(`Invalid Argument: ${context.args[0]}`);
        }

       return message.channel.send('Records Updated');
    }
}

export default StreamLeader;