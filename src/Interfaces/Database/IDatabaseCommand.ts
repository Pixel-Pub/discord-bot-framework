interface NamedataField {
    AllowedRoles?: string[];
    AllowedChannels?: string[];
}

interface Namedata {
    [index: string]: NamedataField
}

export default interface IDatabaseCommand {
    AllowedRoles?: string[];
    AllowedChannels?: string[];
    Data?: any;
    Namedata: Namedata,
    Namespace?: string;
}