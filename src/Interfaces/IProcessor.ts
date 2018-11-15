import ICommandList from "./ICommandList";
import IContext from "./IContext";

export default interface IProcessor {
    Commands: ICommandList;
    Context : IContext;
    Loaded  : boolean;
    Prefix  : string;
}