import {Message} from 'discord.js';

export default interface ICommand {    
    AllowedChannels  : string[];
    AllowedRoles     : string[];
    AllowedUsers     : string[];
    Data             : {};
    RequiresDatabase : boolean;
    Run              : (message: Message) => Promise<any>;
    Signature        : string;
}