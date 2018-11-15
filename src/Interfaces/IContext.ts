import IState from "./IState";
import { Client } from "discord.js";

export default interface IContext {
    Client  : Client;
    Loading : boolean;
    State   : IState;
}