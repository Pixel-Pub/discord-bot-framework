import IContext from '../Interfaces/IContext';
import IState from '../Interfaces/IState';
import mongoose from 'mongoose'
import Users from '../Database/Models/Users';
import Commands from '../Database/Models/Commands';
import State from '../Models/State';
import { Client } from 'discord.js';

export default class Context implements IContext {
    Client  : Client;
    Loading : boolean;
    State   : IState;

    constructor(client: Client) {
        this.Loading = true;
        this.Client  = client;

        mongoose
            .connect(process.env.CONNECTION_STRING)
            .then(async () => {
                const users         = await Users.find();
                const commands      = await Commands.find();
                const usersState    = {};
                const commandsState = {};

                users.forEach((user) => { 
                    usersState[user.Name] = user;
                })

                commands.forEach((command) => {
                    commandsState[command.Namespace] = command;
                })

                this.State   = new State(commandsState, usersState);
                this.Loading = false;

                return this.Loading;
            })
            .then(() => {
                console.log('[SUCCESS] Database Loaded')
            })
            .catch((e) => {
                console.error('[ERROR] Database Failed to Load', e)
            })
    }

    public async Save() {
        
    }
}