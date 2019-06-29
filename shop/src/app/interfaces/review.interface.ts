import { User } from './user.interface';

export interface Review {
    evaluation: number,
    description: string,
    date: {seconds: number, nanoseconds: number},
    author: string | User,
}