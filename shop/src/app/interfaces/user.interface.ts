import { Order } from './order.interface';

export interface User {
    firstName: string;
    lastName: string;
    country: string;
    city: string;
    email: string;
    credit: Order[];
    password?: string;
    uid?: string;
}