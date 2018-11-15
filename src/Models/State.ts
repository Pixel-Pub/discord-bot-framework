import IState from "../Interfaces/IState";
import IUsers from "../Interfaces/Database/IUsers";
import ICommands from "../Interfaces/Database/ICommands";

export default class State implements IState {
    Users    : {
        [index: string]: IUsers
    };
    Commands : {
        [index: string]: ICommands
    };

    constructor(commands: any, users: any) {
        this.Commands = commands;
        this.Users    = users;
    }
};