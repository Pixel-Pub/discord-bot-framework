import Command from '../Abstractions/Command';

export default interface ICommandList {    
    [index: string]: Command
}