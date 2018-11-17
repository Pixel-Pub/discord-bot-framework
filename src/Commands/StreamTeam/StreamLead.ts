import Command from "../../Abstractions/Command";
import { Message } from "discord.js";

class StreamLead extends Command {
    static NAME  = 'StreamLead';
    static ROLES = [
        '298481589506015232',
        '298481229316227073'
    ];

    public Name(): string { 
        return 'StreamLeader';
    }
    public Namespace(): string { 
        return 'StreamTeam';
    }

    public constructor(channels: string[], roles: string[], dbRequired = false) {
        super(channels, StreamLead.ROLES, dbRequired);

        console.log('StreamLead Ignoring:', roles);
    }


    public async Run(message: Message): Promise<any> {
        const context = this.GetContext(message);

        return message.channel.send(`Stuff received: ${JSON.stringify({context, ...this.Data.Roles})}`);
    }
}

export default StreamLead;