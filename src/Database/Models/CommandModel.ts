import { Document, Schema, Model, model } from 'mongoose';
import IDatabaseCommand from '../../Interfaces/Database/IDatabaseCommand'

const {Types} = Schema

export interface ICommandModel extends IDatabaseCommand, Document {}

const CommandSchema: Schema = new Schema({
    AllowedRoles: [Types.String],
    AllowedChannels: [Types.String],
    CreatedAt: [Types.Date],
    Data: Types.Mixed,
    Namespace: Types.String
})

CommandSchema.pre('save', (next) => {
    const now = new Date();

    if (!this.CreatedAt) {
        this.CreatedAt = now;
    }

    next();
})

export const CommandModel: Model<ICommandModel> = model<ICommandModel>("Commands", CommandSchema)

export default CommandModel