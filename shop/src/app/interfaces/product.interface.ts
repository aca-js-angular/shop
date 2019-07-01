import { ColorFilter } from './color-filter.interface';
import { User } from '../interfaces/user.interface';
import { ProductSingleComment } from './product-comment.interface';

export interface Product {

    brand: string;
    category: string;
    gender: 'men' | 'women' | 'unisex';
    name: string;
    price: number;
    rating: number;
    images: string[];
    postDate: number;
    comments?: ProductSingleComment[];
    details: {
        colors: ColorFilter;
        material: string[];
        originCountry: string;
        weight: number;
    };
    vendor: string | User;
    id?: string;
}


