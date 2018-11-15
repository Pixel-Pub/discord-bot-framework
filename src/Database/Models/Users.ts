import { Document, Schema, Model, model } from 'mongoose';
import IUsers from '../../Interfaces/Database/IUsers'

const {Types} = Schema;

export interface IUsersModel extends IUsers, Document {};

// const DataSchema: Schema = new Schema({
//     AllowedRoles: [Types.String],
//     AllowedChannels: [Types.String],
//     Name: Types.String
// });

const UsersSchema: Schema = new Schema({
    CreatedAt : Types.Date,
    Name      : Types.String,
    Roles     : [Types.String]
});

UsersSchema
    .pre('save', (next) => {
        const now = new Date();

        if (!this.CreatedAt) {
            this.CreatedAt = now;
        }

        next();
    });

const Users: Model<IUsersModel> = model<IUsersModel>("Users", UsersSchema);

export default Users;