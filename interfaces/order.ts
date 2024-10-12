import { IProduct, ISize } from "./products";
import { IUser } from "./user";

export interface IOrder {
    id: string;
    amount_subtotal: number;
    amount_total: number;
    status: string;
    transaction_id: string;
    created_at?: string;
    updated_at?: string;
    user: IUser;
    details: IOrderItem[];
}

export interface IOrderItem {
    id: number;
    quantity: number;
    size: ISize;
    price_per_unit: number;
    subtotal: number;
    product: IProduct
}