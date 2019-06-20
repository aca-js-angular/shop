import { ColorFilter } from './color-filter.interface';
import { Vendor } from './vendor.interface';

export interface Product {

    brand: string;
    category: string;
    gender: 'men' | 'women' | 'unisex';
    name: string;
    price: number;
    rating: number;
    images: string[];
    postDate: number;
    details: {
        colors: ColorFilter;
        material: string[];
        originCountry: string;
        weight: number;
    };
    vendor: string | Vendor;
    id?: string;
}