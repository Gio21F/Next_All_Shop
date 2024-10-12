export interface IUser {
    id: string;
    fullName?: string;
    email: string;
    avatar: string;
    password?: string;
    profile_image?: string;
    banner_image?: string;
    roles: [string];
    token?: string;
    created_at?: string;
    updated_at?: string;
}