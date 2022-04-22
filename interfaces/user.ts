export interface IUser {
    _id: string;
    name: string;
    email: string;
    password?: string;
    avatar?: string;
    role: string;
    createdAt?: string;
    updatedAt?: string;
}