import Command from "../Command";
import { Message } from "discord.js";

class Administration extends Command {
    public Name(): string { 
        return 'Administration';
    }
    public Namespace(): string { 
        return 'Administration';
    }

    public async Run(message: Message): Promise<any> {
        return message;
    }
}

export default Administration;