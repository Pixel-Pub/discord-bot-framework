import IDatabase from '../Interfaces/IDatabase';
import IContext from '../Interfaces/IContext';

export default class Context implements IContext {
    Database : IDatabase;
    State    : any;

    constructor(database: IDatabase, state: any) {
        this.Database = database
        this.State    = state
    }
}