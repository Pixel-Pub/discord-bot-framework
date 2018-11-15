export interface Datafield {
    AllowedRoles    ?: string[];
    AllowedChannels ?: string[];
    Data            ?: any;
}

export interface Data {
    [index: string] : Datafield
}

export default interface ICommands {
    AllowedRoles    ?: string[];
    AllowedChannels ?: string[];
    Data            ?: Data;
    Namespace       ?: string;
}