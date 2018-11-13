import Command from "../Abstractions/Command";
import { Message } from "discord.js";

class TestCommand extends Command {
    static Name: 'test';
    public Name = () => TestCommand.Name

    static Namespace: 'test';
    public Namespace = () => TestCommand.Namespace

    public Run(message: Message) {
        return Promise.resolve(message)
    }

}

const content = {
    [TestCommand.Name]: TestCommand
}

export default content