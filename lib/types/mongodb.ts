import { ObjectId } from 'mongodb';

export interface IUser {
    _id?: ObjectId;
    email: string;
    password: string;
}

export interface IMessage {
    _id?: ObjectId;
    email: string;
    name: string;
    message: string;
}
