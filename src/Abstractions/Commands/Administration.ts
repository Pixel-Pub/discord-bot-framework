import Command from "../Command";
import { Message } from "discord.js";

class Administration extends Command {
    public Name      = () => 'Administration';
    public Namespace = () => 'Administration';

    public async Run(message: Message): Promise<any> {
        return message;
    }
}

export default Administration;