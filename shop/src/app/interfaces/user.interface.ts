import { Order } from './order.interface';
import { Review } from './review.interface';

export interface FirebaseTimestamp {
    seconds: number;
    nanoseconds: number;
}

export interface User {
    firstName: string;
    lastName: string;
    country: string;
    city: string;
    email: string;
    credit: Order[];
    rating: number;
    img: string;
    registeredDate: Date | FirebaseTimestamp;
    reviews: Review[];
    id?: string;
    uid?: string;
    password?: string;
}