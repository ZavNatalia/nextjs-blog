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

export type CommentStatus = 'approved' | 'pending' | 'rejected';

export interface IComment {
    _id?: ObjectId;
    postSlug: string;
    authorEmail: string;
    authorName: string;
    content: string;
    status: CommentStatus;
    createdAt: Date;
    updatedAt?: Date;
}
