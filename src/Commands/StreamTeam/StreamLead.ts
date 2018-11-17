import Command from "../../Abstractions/Command";
import { Message } from "discord.js";

class StreamAdministration extends Command {
    public Name(): string { 
        return 'StreamLeader';
    }
    public Namespace(): string { 
        return 'StreamTeam';
    }

    public constructor(channels: string[], roles: string[], dbRequired = false) {
        super(channels, ['test'], dbRequired)

        console.log('StreamLeader Ignoring:', roles)
    }

    private async add(user: string): Promise<any> {
        if (!this.Data.Roles && user) {
            this.Data.Roles = [user];
        } else if (this.Data.Roles && !this.Data.Roles.includes(user)) {
            this.Data.Roles.push(user);
        }

        return true;
    }

    private async delete(user: string): Promise<any> {
        if (this.Data.Roles && this.Data.Roles.includes(user)) {
            this.Data.Roles = this.Data.Roles.filter((id => id !== user));
        }

        return true;
    }

    public async Run(message: Message): Promise<any> {
        const context = this.GetContext(message);

        switch((context.args[0] || '').toLowerCase()) {
            case 'add':
                await this.add(context.args[1]);
                break;
            case 'delete':
                await this.delete(context.args[1])
                break;
            default:
                console.error()
                break;
        }

        // message.spit out 'success'
    }
}

export default StreamAdministration;