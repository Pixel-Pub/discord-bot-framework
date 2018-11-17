export interface Datafield {
    AllowedUsers    ?: string[];
    AllowedRoles    ?: string[];
    AllowedChannels ?: string[];
    Data            ?: any;
}

export interface Data {
    [index: string] : Datafield
}

export default interface ICommands {
    AllowedUsers    ?: string[];
    AllowedRoles    ?: string[];
    AllowedChannels ?: string[];
    Data            ?: Data;
    Namespace       ?: string;
}