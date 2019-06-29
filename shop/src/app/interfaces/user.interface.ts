import { Order } from './order.interface';
import { Review } from './review.interface';

export interface User {
    firstName: string;
    lastName: string;
    country: string;
    city: string;
    email: string;
    credit: Order[];
    rating: number;
    img: string;
    registeredDate: Date;
    reviews: Review[];
    uid?: string;
    password?: string;
}