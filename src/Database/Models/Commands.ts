import { Document, Schema, Model, model } from 'mongoose';
import ICommands from '../../Interfaces/Database/ICommands';

const {Types} = Schema;

export interface ICommandsModel extends ICommands, Document {};

// const DataSchema: Schema = new Schema({
//     AllowedRoles: [Types.String],
//     AllowedChannels: [Types.String],
//     Name: Types.String
// });

const CommandsSchema: Schema = new Schema({
    AllowedRoles:    [Types.String],
    AllowedChannels: [Types.String],
    AllowedUsers:    [Types.String],
    CreatedAt:       [Types.Date],
    Data:            Types.Mixed,
    Namespace:       Types.String
});

CommandsSchema
    .pre('save', (next) => {
        const now = new Date();

        if (!this.CreatedAt) {
            this.CreatedAt = now;
        }

        next();
    });

const Commands: Model<ICommandsModel> = model<ICommandsModel>("Commands", CommandsSchema);

export default Commands;