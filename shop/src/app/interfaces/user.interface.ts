import { Order } from './order.interface';
import { Review } from './review.interface';

export interface FirebaseTimestamp {
    seconds: number;
    nanosecond: number;
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
    uid?: string;
    password?: string;
}