export interface Product {

    brand: string;
    category: string;
    gender: 'men' | 'women' | 'unisex';
    name: string;
    price: number;
    rating: string;
    images: string[];
    postDate: number;
    details: {
        colors: string[];
        material: string[];
        originCountry: string;
        weight: number;
    };
    vendor: {
        city: string;
        country: string;
        email: string;
        fullName: string;
        img: string;
        rating: string;
    }
    
}