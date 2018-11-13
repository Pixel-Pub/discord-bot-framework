import IDatabase from "./IDatabase";

export default interface IContext {
    Database : IDatabase,
    State    : any 
}