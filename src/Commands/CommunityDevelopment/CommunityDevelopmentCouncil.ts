import Command from "../../Abstractions/Command";
import { Message } from "discord.js";

class CommunityDevelopmentCouncil extends Command {
    static NAME  = 'CommunityDevelopmentCouncil';
    static ROLE  = '477986457244401675';
    static ROLES = [
        '509747336990162945',
        '298481229316227073'
    ];

    public Name(): string { 
        return 'CommunityDevelopmentCouncil';
    }
    public Namespace(): string { 
        return 'CommunityDevelopment';
    }

    public constructor(channels: string[], roles: string[], users: string[], dbRequired = false) {
        super(channels, CommunityDevelopmentCouncil.ROLES, users, dbRequired);

        console.log('CommunityDevelopmentCouncil Ignoring:', roles);
    }

    private async AddDiscordRole(message: Message, id): Promise<any> {
        const guild  = message.guild;
        const member = guild.members.find((member) => member.id === id);

        if (!member.roles.has(CommunityDevelopmentCouncil.ROLE)) {
            member.addRole(CommunityDevelopmentCouncil.ROLE, `Added by ${message.author.username}`);
        }
    }

    private async RemoveDiscordRole(message: Message, id: string): Promise<any> {
        const guild  = message.guild;
        const member = guild.members.find((member) => member.id === id);

        if (member.roles.has(CommunityDevelopmentCouncil.ROLE)) {
            return member.removeRole(CommunityDevelopmentCouncil.ROLE,  `Removed by ${message.author.username}`);
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

export default CommunityDevelopmentCouncil;