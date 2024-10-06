export interface IUser {
    id: string;
    fullName?: string;
    email: string;
    password?: string;
    profile_image?: string;
    banner_image?: string;
    roles: [string];
    token?: string;
    createdAt?: string;
    updatedAt?: string;
}